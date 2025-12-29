import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly ACCESS_EXPIRES: StringValue = (process.env
    .JWT_ACCESS_EXPIRES ?? '15m') as StringValue;

  private readonly REFRESH_EXPIRES: StringValue = (process.env
    .JWT_REFRESH_EXPIRES ?? '7d') as StringValue;

  private readonly ACCESS_SECRET: string =
    process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret';

  private readonly REFRESH_SECRET: string =
    process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret';

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.users.createWithPasswordHash({
      email: dto.email,
      username: dto.username,
      passwordHash,
      role: UserRole.USER,
    });

    return this.issueTokensAndStoreRefresh(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokensAndStoreRefresh(user.id, user.email, user.role);
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.users.findById(userId);
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException();

    const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!ok) throw new UnauthorizedException();

    return this.issueTokensAndStoreRefresh(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    await this.users.update(userId, { refreshTokenHash: null });
    return { ok: true };
  }

  private async issueTokensAndStoreRefresh(
    sub: string,
    email: string,
    role: UserRole,
  ) {
    const accessToken = this.jwt.sign(
      { sub, email, role },
      { secret: this.ACCESS_SECRET, expiresIn: this.ACCESS_EXPIRES },
    );

    const refreshToken = this.jwt.sign(
      { sub },
      { secret: this.REFRESH_SECRET, expiresIn: this.REFRESH_EXPIRES },
    );

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.users.update(sub, { refreshTokenHash: hash });

    return { accessToken, refreshToken };
  }
}
