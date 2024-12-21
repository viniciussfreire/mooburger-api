import { z } from "zod";

export const schema = z.object({
	ENV: z.enum(["local"]).default("local"),

	HOST: z.string().default("0.0.0.0"),
	PORT: z
		.string()
		.default("3333")
		.transform((value) => Number(value)),

	DATABASE_URL: z
		.string()
		.default("jdbc:postgresql://admin@adminlocalhost:5432/mooburger"),
});

export type Envs = z.infer<typeof schema>;

export const envs = schema.parse(process.env);
