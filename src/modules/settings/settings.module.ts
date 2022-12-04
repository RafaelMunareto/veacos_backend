import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GrupoController } from './grupo.controller';
import { GrupoService } from './grupo.service';
import { GrupoSchema } from './schemas/grupo.schema';
import { SettingsSchema } from './schemas/settings.schema';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import * as fs from 'fs';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Settings',
        schema: SettingsSchema,
      },
      {
        name: 'Grupo',
        schema: GrupoSchema,
      },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        return {
          storage: diskStorage({
            destination: async (req, file, cb) => {
              const path = './upload';
              return cb(null, path);
            },
            filename: (req, file, cb) => {
              if (file.originalname == 'person.png') {
                return cb(null, file.originalname);
              } else {
                if (fs.existsSync(`./upload/${file.originalname}`)) {
                  fs.unlinkSync(`./upload/${file.originalname}`);
                }
                return cb(null, file.originalname);
              }
            },
          }),
        };
      },
    }),
  ],
  controllers: [SettingsController, GrupoController],
  providers: [SettingsService, GrupoService],
})
export class SettingsModule {}
