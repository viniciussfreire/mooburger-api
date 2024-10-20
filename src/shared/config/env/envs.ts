import { z } from "zod";

export const schema = z.object({
	ENV: z.enum(["local"]).default("local"),

	HOST: z.string().default("0.0.0.0"),
	PORT: z
		.string()
		.default("3333")
		.transform((value) => Number(value)),
});

export type Envs = z.infer<typeof schema>;

export const envs = schema.parse(process.env);
