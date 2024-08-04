import { IsString, IsNumber, IsOptional } from 'class-validator';
export class CreateIntershipDto {
    @IsString()
    title: string;

    @IsString()
    place: string;

    @IsString()
    fields: string;

    @IsString()
    description: string;

    @IsString()
    duration: string;

    @IsString()
    qualifications: string;

    @IsString()
    whoyouare: string;

    @IsString()
    finalDate: string;

    @IsString()
    postedDate: string;

    @IsOptional()
    @IsNumber()
    company: number;
}