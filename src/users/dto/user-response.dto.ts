import { UserRole } from '../user.entity';

export class UserResponseDto {
  id!: string;
  email!: string;
  username?: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;
}
