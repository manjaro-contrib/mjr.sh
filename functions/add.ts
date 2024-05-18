import z from "zod";
import { sql } from "kysely";
import { createHash, getDB, type Env } from "./utils";

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

  const { hash, plaintextSecret } = await createHash({
    plaintextSecret: crypto.randomUUID(),
    salt: context.env.SALT,
  });
  // int between 3 and 6
  const keyLength = Math.floor(Math.random() * 4) + 3;

  const result = await db
    .insertInto("urls")
    .values({
      key: sql`substr(hex(randomblob(3)), 0, ${keyLength})`,
      value: input.data.url,
      secret: hash,
    })
    .returning(["key", "timestamp", "value"])
    .executeTakeFirstOrThrow();

  const url = new URL(context.request.url);
  url.pathname = result.key;
  url.search = "";

  const editUrl = new URL(context.request.url);
  editUrl.pathname = `${result.key}/edit`;
  editUrl.search = "";
  editUrl.searchParams.set("secret", plaintextSecret);
  editUrl.searchParams.set("url", "https://example.com");

  const statsUrl = new URL(context.request.url);
  statsUrl.pathname = `${result.key}/stats`;
  statsUrl.search = "";

  return Response.json({
    url: url.toString(),
    edit: editUrl.toString(),
    stats: statsUrl.toString(),
    ...result,
    secret: plaintextSecret,
  });
};
