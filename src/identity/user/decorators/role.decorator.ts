import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const USER_ROLE_KEY = 'role';

export const Role = (role: UserRole) => SetMetadata(USER_ROLE_KEY, role);
