import { Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const logger = new Logger("FlushPgTables");

export const flushPgTables = async (): Promise<void> => {
	try {
		logger.log("🤖 - Flushing all tables...");

		await prisma.customer.deleteMany({});

		logger.log("🤖 - Tables flushed");
	} catch (error) {
		logger.error("🤖 - Error flushing tables", error);
	} finally {
		await prisma.$disconnect();
	}
};
