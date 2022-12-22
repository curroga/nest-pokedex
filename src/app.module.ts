import { join } from 'path'; // pquete que viene de node (se ponen al inicio)
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),

      MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'), // conexión con la base de datoss

    PokemonModule, CommonModule,
  ],
})  
export class AppModule {}
