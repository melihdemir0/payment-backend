import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
  async getUserById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    return user;
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.repo.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });

    return this.repo.save(user);
  }

  async update(id: string, data: Partial<User>) {
    await this.repo.update({ id }, data);
    return this.findById(id);
  }

  findAll() {
    return this.repo.find();
  }
  async createWithPasswordHash(data: {
    email: string;
    username?: string;
    passwordHash: string;
    role?: UserRole;
  }) {
    const user = this.repo.create({
      email: data.email,
      username: data.username,
      passwordHash: data.passwordHash,
      role: data.role ?? UserRole.USER,
    });
    return this.repo.save(user);
  }
}
