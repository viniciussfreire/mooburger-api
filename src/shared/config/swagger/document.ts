import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
	.setTitle("MooBurger API")
	.setDescription(
		"Hamburger shop management system developed for the Tech Challenge in software architecture at FIAP",
	)
	.setVersion("1.0")
	.addTag("Health")
	.addTag("Customers")
	.build();
