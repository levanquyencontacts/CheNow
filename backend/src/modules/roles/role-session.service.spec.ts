import { RoleSessionService } from './role-session.service';

describe('RoleSessionService', () => {
  it('does not fail the committed role-change request when a listener fails', async () => {
    const service = new RoleSessionService();
    service.subscribe(() => Promise.reject(new Error('socket unavailable')));

    await expect(service.invalidateUser(42)).resolves.toBeUndefined();
  });
});
