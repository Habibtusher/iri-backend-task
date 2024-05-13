/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    RedisModule.register({
      host: 'https://national-aardvark-44492.upstash.io',
      port: 6379,
      password:
        'Aa3MAAIncDEzNjk4ODhkYTI2NWU0ZDRmYTI5ZDkyMTFkYmIxYzY0ZHAxNDQ0OTI',
    }),
  ],
})
export class RedisConfigModule {}