import z from "zod";
import { getDB, type Env } from "./[key]";
import { sql } from "kysely";

const queryValidator = z.object({
  url: z.string().url(),
});

export const onRequest: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const input = queryValidator.safeParse(Object.fromEntries(searchParams));

  if (!input.data.url) {
    return Response.json(input.error, { status: 400 });
  }

  const db = getDB(context.env);

  // cleanup examples
  await db
    .deleteFrom("urls")
    .where("value", "=", "https://example.com")
    .execute();

  const result = await db
    .insertInto("urls")
    .values({
      key: sql`hex(randomblob(2))`,
      value: input.data.url,
    })
    .returning("key")
    .executeTakeFirstOrThrow();


  const url = new URL(context.request.url);
  url.pathname = result.key;
  url.search = "";

  return Response.json({ url: url.toString() });
};
