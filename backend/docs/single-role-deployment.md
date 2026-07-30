# Single-role migration deployment notes

## Production duplicate-email preflight

Run this read-only query against the deployment database before the maintenance
window and again immediately before `npm run migration:run`:

```sql
SELECT
  LOWER(TRIM("email")) AS "normalizedEmail",
  ARRAY_AGG("id" ORDER BY "id") AS "userIds",
  COUNT(*) AS "count"
FROM "users"
GROUP BY LOWER(TRIM("email"))
HAVING COUNT(*) > 1;
```

The required result is zero rows. Any result is a data-quality deployment
blocker: stop and resolve it through an approved account correction or merge
plan. Do not remove the migration guard, automatically delete a user, or run
`migration:revert` when the new migration was rolled back and was never recorded
in the `migrations` table.

Before resolving a duplicate, inventory roles, customer profile, orders,
addresses, cart, conversations, participants, messages, refresh tokens, and
order-status logs for every affected user. If the records represent different
people, verify and assign a unique email and revoke that account's refresh
tokens. If they represent the same person, choose a canonical account and move
each dependency inside a reviewed transaction before archiving or removing the
duplicate according to the data-retention policy. Never directly delete a
duplicate while dependent rows still exist.

## Rollback window and backup data

The migration creates backup and audit tables that include email addresses and
therefore contain personal data. Restrict access to the same principals allowed
to access production user data, exclude these tables from analytics exports, and
retain them only for the agreed deployment rollback window.

Use a 72-hour rollback window unless the release owner approves a different
period. `down()` is intended only for that window: it restores the migration-time
snapshot and can overwrite role, email, or activation changes made after `up()`.
After acceptance, remove the backup and migration-audit tables with a reviewed
follow-up migration according to the project's data-retention process. Do not
leave migration backups indefinitely.

## Session invalidation topology

`RoleSessionService` currently distributes role-change events only inside one
backend process. This is sufficient only while the backend runs as a single
instance.

Before horizontal scaling, replace the in-memory publisher with a shared
transport such as Redis pub/sub (and configure the Socket.IO Redis adapter) or
the platform event bus. Every instance must receive the event and disconnect the
affected user's sockets; otherwise a socket connected to another instance can
keep its old authorization context.
