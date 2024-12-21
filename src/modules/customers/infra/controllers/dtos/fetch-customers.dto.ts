import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class FetchCustomersDto {
	@ApiProperty({
		description: "Customer document",
		example: "92926987021",
		nullable: true,
		required: false,
		type: String,
	})
	@IsString({ message: "The document must be a valid string" })
	@IsOptional()
	document?: string;

	@ApiProperty({
		description: "Customer email",
		example: "john.doe@mail.com",
		nullable: true,
		required: false,
		type: String,
	})
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiProperty({
		description: "Customer email",
		example: "john.doe@mail.com",
		nullable: true,
		required: false,
		type: String,
	})
	@IsString({ message: "The ID must be a valid ULID string" })
	@IsOptional()
	id?: string;

	@ApiProperty({
		description: "Customer name",
		example: "John Doe",
		nullable: true,
		required: false,
		type: String,
	})
	@IsString({ message: "The name must be a valid string" })
	@IsOptional()
	name?: string;

	@ApiProperty({
		description: "Specify whether to sort customers by most recent first",
		example: true,
		nullable: true,
		required: false,
		type: Boolean,
	})
	@IsString({
		message: "The newestFirst must be a valid string (true or false)",
	})
	@IsOptional()
	newestFirst?: string;

	@ApiProperty({
		description: "Specify how many records to include in the response",
		example: 10,
		nullable: true,
		required: false,
		type: Number,
	})
	@IsString({ message: "The newestFirst must be a valid numeric string" })
	@IsOptional()
	pageSize?: string;

	@ApiProperty({
		description: "Specify which record to retrieve from",
		example: "01JFMQQ85EF9XGSEESB2ZBA00A",
		nullable: true,
		required: false,
		type: String,
	})
	@IsString({ message: "The name must be a valid string" })
	@IsOptional()
	pageToken?: string;
}
