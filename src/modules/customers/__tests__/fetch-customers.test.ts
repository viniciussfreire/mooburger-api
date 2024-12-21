import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { UniqueEntityId } from "@/core/entities";
import { PrismaService } from "@/shared/databases/services";
import { CustomersModule } from "../customers.module";

describe("FetchCustomer (Integration Test)", () => {
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

	describe("[GET] /customers", () => {
		it("should be able to fetch all customers", async () => {
			// Arrange
			const johnDoeId = new UniqueEntityId();
			const mathewCollinsId = new UniqueEntityId();
			await prisma.customer.createMany({
				data: [
					{
						id: johnDoeId.toStr(),
						name: "John Doe",
						email: "john.doe@mail.com",
						document: "29524942070",
					},
					{
						id: mathewCollinsId.toStr(),
						name: "Mathew Collins",
						email: "mathew.collins@mail.com",
						document: "01958925004",
					},
				],
			});

			// Act
			const response = await request(app.getHttpServer()).get("/customers");

			// Assert
			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				eof: true,
				items: [
					{
						id: mathewCollinsId.toStr(),
						name: "Mathew Collins",
						document: "01958925004",
						email: "mathew.collins@mail.com",
					},
					{
						id: johnDoeId.toStr(),
						name: "John Doe",
						document: "29524942070",
						email: "john.doe@mail.com",
					},
				],
				pageSize: 10,
				total: 2,
			});
		});

		it("should be able to fetch filtering by id", async () => {
			// Arrange
			const johnDoeId = new UniqueEntityId();
			const mathewCollinsId = new UniqueEntityId();
			await prisma.customer.createMany({
				data: [
					{
						id: johnDoeId.toStr(),
						name: "John Doe",
						email: "john.doe@mail.com",
						document: "29524942070",
					},
					{
						id: mathewCollinsId.toStr(),
						name: "Mathew Collins",
						email: "mathew.collins@mail.com",
						document: "01958925004",
					},
				],
			});

			// Act
			const response = await request(app.getHttpServer()).get(
				`/customers?id=${johnDoeId.toStr()}`,
			);

			// Assert
			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				eof: true,
				items: [
					{
						id: johnDoeId.toStr(),
						name: "John Doe",
						document: "29524942070",
						email: "john.doe@mail.com",
					},
				],
				pageSize: 10,
				total: 1,
			});
		});

		it("should be able to fetch filtering by name", async () => {
			// Arrange
			const johnDoeId = new UniqueEntityId();
			const mathewCollinsId = new UniqueEntityId();
			await prisma.customer.createMany({
				data: [
					{
						id: johnDoeId.toStr(),
						name: "John Doe",
						email: "john.doe@mail.com",
						document: "29524942070",
					},
					{
						id: mathewCollinsId.toStr(),
						name: "Mathew Collins",
						email: "mathew.collins@mail.com",
						document: "01958925004",
					},
				],
			});

			// Act
			const response = await request(app.getHttpServer()).get(
				"/customers?name=John%20Doe",
			);

			// Assert
			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				eof: true,
				items: [
					{
						id: johnDoeId.toStr(),
						name: "John Doe",
						document: "29524942070",
						email: "john.doe@mail.com",
					},
				],
				pageSize: 10,
				total: 1,
			});
		});

		it("should be able to fetch filtering by email", async () => {
			// Arrange
			const johnDoeId = new UniqueEntityId();
			const mathewCollinsId = new UniqueEntityId();
			await prisma.customer.createMany({
				data: [
					{
						id: johnDoeId.toStr(),
						name: "John Doe",
						email: "john.doe@mail.com",
						document: "29524942070",
					},
					{
						id: mathewCollinsId.toStr(),
						name: "Mathew Collins",
						email: "mathew.collins@mail.com",
						document: "01958925004",
					},
				],
			});

			// Act
			const response = await request(app.getHttpServer()).get(
				"/customers?email=mathew.collins@mail.com",
			);

			// Assert
			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				eof: true,
				items: [
					{
						id: mathewCollinsId.toStr(),
						name: "Mathew Collins",
						document: "01958925004",
						email: "mathew.collins@mail.com",
					},
				],
				pageSize: 10,
				total: 1,
			});
		});

		it("should be able to fetch filtering by document", async () => {
			// Arrange
			const johnDoeId = new UniqueEntityId();
			const mathewCollinsId = new UniqueEntityId();
			await prisma.customer.createMany({
				data: [
					{
						id: johnDoeId.toStr(),
						name: "John Doe",
						email: "john.doe@mail.com",
						document: "29524942070",
					},
					{
						id: mathewCollinsId.toStr(),
						name: "Mathew Collins",
						email: "mathew.collins@mail.com",
						document: "01958925004",
					},
				],
			});

			// Act
			const response = await request(app.getHttpServer()).get(
				"/customers?document=01958925004",
			);

			// Assert
			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				eof: true,
				items: [
					{
						id: mathewCollinsId.toStr(),
						name: "Mathew Collins",
						document: "01958925004",
						email: "mathew.collins@mail.com",
					},
				],
				pageSize: 10,
				total: 1,
			});
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
