import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCode } from '../common/enums/common.enum';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { Users } from '../modules/users/users.entities';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<RoleCode[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: Users }>();
    const roleCode = request.user?.userRole?.role?.code;
    return Boolean(roleCode && allowedRoles.includes(roleCode));
  }
}
