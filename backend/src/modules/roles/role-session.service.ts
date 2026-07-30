import { Injectable, Logger } from '@nestjs/common';

type RoleChangeListener = (userId: number) => void | Promise<void>;

@Injectable()
export class RoleSessionService {
  private readonly logger = new Logger(RoleSessionService.name);
  private readonly listeners = new Set<RoleChangeListener>();

  subscribe(listener: RoleChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async invalidateUser(userId: number): Promise<void> {
    const results = await Promise.allSettled(
      [...this.listeners].map((listener) => Promise.resolve(listener(userId))),
    );
    results.forEach((result) => {
      if (result.status === 'rejected') {
        this.logger.error(
          `Role session invalidation failed for user ${userId}`,
          result.reason instanceof Error
            ? result.reason.stack
            : String(result.reason),
        );
      }
    });
  }
}
