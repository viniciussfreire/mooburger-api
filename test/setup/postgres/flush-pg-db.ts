import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

export const flushPgDb = async (): Promise<void> => {
	try {
		console.log("🤖 - Flushing all tables...");

		await prisma.customer.deleteMany({});

		console.log("🤖 - Tables flushed");
	} catch (error) {
		console.error("🤖 - Error flushing tables", error);
	} finally {
		await prisma.$disconnect();
	}
};
