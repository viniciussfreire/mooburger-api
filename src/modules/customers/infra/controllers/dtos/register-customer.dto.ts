import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterCustomerDto {
	@ApiProperty({
		description: "Customer document",
		example: "92926987021",
		nullable: false,
		required: true,
		type: String,
	})
	@IsString({ message: "The document must be a valid string" })
	@IsNotEmpty({ message: "The document is required" })
	document: string;

	@ApiProperty({
		description: "Customer email",
		example: "john.doe@mail.com",
		nullable: false,
		required: true,
		type: String,
	})
	@IsEmail()
	@IsNotEmpty({ message: "The email is required" })
	email: string;

	@ApiProperty({
		description: "Customer name",
		example: "John Doe",
		nullable: false,
		required: true,
		type: String,
	})
	@IsString({ message: "The name must be a valid string" })
	@IsNotEmpty({ message: "The name is required" })
	name: string;
}
