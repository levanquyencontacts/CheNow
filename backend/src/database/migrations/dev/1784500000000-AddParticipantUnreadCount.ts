import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParticipantUnreadCount1784500000000
  implements MigrationInterface
{
  name = 'AddParticipantUnreadCount1784500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "conversation_participants"
      ADD COLUMN IF NOT EXISTS "unreadCount" integer NOT NULL DEFAULT 0
    `);

    // Backfill: unanswered customer messages after the last staff reply.
    // Ignores stale lastReadAt that may have been auto-marked on page load.
    await queryRunner.query(`
      UPDATE "conversation_participants" AS p
      SET "unreadCount" = COALESCE((
        SELECT COUNT(*)::int
        FROM "messages" AS m
        WHERE m."conversationId" = p."conversationId"
          AND m."deletedAt" IS NULL
          AND m."senderRole" = 'customer'
          AND m."senderId" <> p."userId"
          AND m.id > COALESCE((
            SELECT MAX(staff.id)
            FROM "messages" AS staff
            WHERE staff."conversationId" = p."conversationId"
              AND staff."deletedAt" IS NULL
              AND staff."senderRole" = 'admin'
          ), 0)
      ), 0)
      WHERE p."participantRole" = 'admin'
    `);

    await queryRunner.query(`
      UPDATE "conversation_participants" AS p
      SET "unreadCount" = COALESCE((
        SELECT COUNT(*)::int
        FROM "messages" AS m
        WHERE m."conversationId" = p."conversationId"
          AND m."deletedAt" IS NULL
          AND m."senderId" <> p."userId"
          AND (
            p."lastReadAt" IS NULL
            OR m."createdAt" > p."lastReadAt"
          )
      ), 0)
      WHERE p."participantRole" = 'customer'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "conversation_participants"
      DROP COLUMN IF EXISTS "unreadCount"
    `);
  }
}
