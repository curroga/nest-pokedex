import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {


  transform(value: string, metadata: ArgumentMetadata) {
    // console.log({ value, metadata });

    if ( !isValidObjectId(value) ){ // si no es un objectc value id (en el path) entonces nos lanza un error
      throw new BadRequestException(`${ value } is not a valid MongoId`);
      
    }

    return value;
  }


}
