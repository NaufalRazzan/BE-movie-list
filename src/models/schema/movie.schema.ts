import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MovieDocument = Movie & Document

@Schema()
export class Movie{
    @Prop({unique: true})
    title: string

    @Prop()
    codeTitle: string

    @Prop()
    genres: string

    @Prop()
    duration: string

    @Prop()
    rating: string
}

export const MovieSchema = SchemaFactory.createForClass(Movie)