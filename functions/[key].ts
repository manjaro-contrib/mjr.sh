import { Kysely, ParseJSONResultsPlugin } from "kysely";
import { D1Dialect } from "kysely-d1";
import z from "zod";

export type Env = {
  urls: D1Database;
};

type Table = {
  key: string;
  value: string;
  secret: string;
  timestamp: string;
};

interface Database {
  urls: Table;
}

export const getDB = (env: Env) => {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: env.urls })
  });
};

const paramsValidator = z.object({
  key: z.string().length(4),
});

export const onRequest: PagesFunction<Env> = async (context) => {
  const db = getDB(context.env);

  const input = paramsValidator.safeParse(context.params);

  if (!input.success) {
    return Response.json(input.error, { status: 400 });
  }
  const { key } = input.data;

  const result = await db
    .selectFrom("urls")
    .select(["value"])
    .where("key", "=", key)
    .executeTakeFirstOrThrow();

  const response = Response.redirect(result.value, 301);

  return response;
};
