import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';



import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {
      this.handleExceptions( error )
    }


  }

  findAll() {
    return `This action returns all pokemon`;
  }

   async findOne(term: string) { // term === id(puede ser un numero o un string o lo que sea), lo hemos cambiado para diferenciarlo
    
    let pokemon: Pokemon;

    if ( !isNaN( +term ) ){ // si es un numero hacemos la evaluación
      pokemon = await this.pokemonModel.findOne({ no: term })
    }
    
    // MongoID
    if ( !pokemon && isValidObjectId( term ) ) { // si no existe pokemon y es un objectId
      pokemon = await this.pokemonModel.findById( term );
    }

    // Name
    if ( !pokemon ) { // si no es un pokemon
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })  
    }

    if ( !pokemon ) // si no es un pokemon y no se han dado ninguno de los anteriores casos enotnces muestra el mensaje
    throw new NotFoundException(`Pokemon whith id, name or no "${ term }" not found`);
    
    return pokemon;
  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto ) {

    const pokemon = await this.findOne( term );
    if ( updatePokemonDto.name )
    updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne( updatePokemonDto );
      
      return { ...pokemon.toJSON(), ...updatePokemonDto  }; // ...pokemon.toJSON (EXPARSO TODAS LAS PROPIEDADES QUE TIENE) Y DESpues sobrescribimos todas las propiedades que tiene   
      
    } catch (error) {
      this.handleExceptions( error )
    }

  }

   async remove( id: string ) {
    // // const pokemon = await this.findOne( id );
    // // await pokemon.deleteOne();

    // return {id}
    // const result = await this.pokemonModel.findByIdAndDelete( id ); // el await espera a que se haga este procedimiento (recordatorio)

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id  }); // esta solucion es mejor que la anterior
    if ( deletedCount === 0 ) throw new BadRequestException(`Pokemon with id "${ id }" not found`)
    return;
  }

  private handleExceptions( error: any ) { // para evitar codigo duplicado
    if ( error.code === 11000 ){
      throw new BadRequestException(`Pokemon exists isn db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can´t update Pokemon - Check server logs`)
  }
}
