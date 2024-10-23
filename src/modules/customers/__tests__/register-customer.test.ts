import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { ulid } from "ulid";

import { PrismaService } from "@/shared/databases/services";
import { CustomersModule } from "../customers.module";

describe("RegisterCustomer (Integration Test)", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [CustomersModule],
		}).compile();

		app = module.createNestApplication();
		await app.init();

		prisma = await app.resolve(PrismaService);
	});

	describe("[POST] /customers", () => {
		it("should be able to register a new customer", async () => {
			// Arrange
			const payload = {
				name: "John Doe",
				email: "john.doe@mail.com",
				document: "29524942070",
			};

			// Act
			const response = await request(app.getHttpServer())
				.post("/customers")
				.send(payload);

			// Assert
			expect(response.status).toBe(201);
			expect(response.body).toEqual({});

			const customer = await prisma.customer.findUnique({
				where: {
					document: payload.document,
				},
			});

			expect(customer).toBeTruthy();
			expect(customer?.name).toEqual(payload.name);
			expect(customer?.email).toEqual(payload.email);
			expect(customer?.document).toEqual(payload.document);
		});

		it("should not be able to register a new customer with invalid document", async () => {
			// Arrange
			const payload = {
				name: "John Doe",
				email: "john.doe@mail.com",
				document: "295249420",
			};

			// Act
			const response = await request(app.getHttpServer())
				.post("/customers")
				.send(payload);

			// Assert
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				statusCode: 400,
				message: `The document "295249420" is invalid`,
			});

			const customer = await prisma.customer.findUnique({
				where: {
					document: payload.document,
				},
			});

			expect(customer).toBeNull();
		});

		it("should not be able to register a new customer with invalid email", async () => {
			// Arrange
			const payload = {
				name: "John Doe",
				email: "john.doe@mail",
				document: "29524942070",
			};

			// Act
			const response = await request(app.getHttpServer())
				.post("/customers")
				.send(payload);

			// Assert
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				statusCode: 400,
				message: `The email "john.doe@mail" is invalid`,
			});

			const customer = await prisma.customer.findUnique({
				where: {
					document: payload.document,
				},
			});

			expect(customer).toBeNull();
		});

		it("should not be able to register a new customer with an existing document", async () => {
			// Arrange
			await prisma.customer.create({
				data: {
					id: ulid(),
					name: "John Doe",
					email: "john.doe@mail.com",
					document: "29524942070",
				},
			});

			const payload = {
				name: "John Doe",
				email: "john.doe@mail.com",
				document: "29524942070",
			};

			// Act
			const response = await request(app.getHttpServer())
				.post("/customers")
				.send(payload);

			// Assert
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				statusCode: 400,
				message: "Customer with document or email already exists",
			});

			const customer = await prisma.customer.findMany({
				where: {
					document: payload.document,
				},
			});

			expect(customer).toHaveLength(1);
		});

		it("should not be able to register a new customer with an existing email", async () => {
			// Arrange
			await prisma.customer.create({
				data: {
					id: ulid(),
					name: "John Doe",
					email: "john.doe@mail.com",
					document: "29524942070",
				},
			});

			const payload = {
				name: "John Doe",
				email: "john.doe@mail.com",
				document: "40581046005",
			};

			// Act
			const response = await request(app.getHttpServer())
				.post("/customers")
				.send(payload);

			// Assert
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				statusCode: 400,
				message: "Customer with document or email already exists",
			});

			const customer = await prisma.customer.findMany({
				where: {
					email: payload.email,
				},
			});

			expect(customer).toHaveLength(1);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
