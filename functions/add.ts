import z from "zod";
import { sql } from "kysely";
import { getDB, type Env } from "./utils";

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
      secret: sql`hex(randomblob(10))`,
    })
    .returning(["key", "secret", "timestamp", "value"])
    .executeTakeFirstOrThrow();

  const url = new URL(context.request.url);
  url.pathname = result.key;
  url.search = "";

  const editUrl = new URL(context.request.url);
  editUrl.pathname = `edit/${result.secret}`;
  editUrl.search = "";
  editUrl.searchParams.set("url", "https://example.com");

  const statsUrl = new URL(context.request.url);
  statsUrl.pathname = `${result.key}/stats`;
  statsUrl.search = "";

  return Response.json({
    url: url.toString(),
    edit: editUrl.toString(),
    stats: statsUrl.toString(),
    ...result,
  });
};
