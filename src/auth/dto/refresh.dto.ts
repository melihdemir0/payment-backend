import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ example: 'user-id-or-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'refresh_token_here' })
  @IsString()
  refreshToken: string;
}
