import { IsEnum } from 'class-validator';
import { RoleCode } from '../../../common/enums/common.enum';

export class ChangeUserRoleDto {
  @IsEnum(RoleCode)
  roleCode: RoleCode;
}
