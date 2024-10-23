import { exec } from "node:child_process";
import util from "node:util";
import { Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const logger = new Logger("RunPrismaMigrations");

const execPromise = util.promisify(exec);

export const runPrismaMigrations = async () => {
	try {
		logger.log("🤖 - Running migrations...");

		await execPromise("npx prisma migrate deploy");
	} catch (error) {
		logger.error("🤖 - Error running migrations", error);
		await prisma.$disconnect();
	}
};
