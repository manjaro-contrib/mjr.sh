import z from "zod";
import { sql } from "kysely";
import { createHash, getDB, type Env } from "./utils";

const queryValidator = z.object({
  url: z.string().url(),
});

export const onRequest: PagesFunction<Env> = async (context) => {
  console.log(context.request.headers);
  const { searchParams } = new URL(context.request.url);
  const input = queryValidator.safeParse(Object.fromEntries(searchParams));

  if (!input.data.url) {
    return Response.json(input.error, { status: 400 });
  }

  const db = getDB(context.env);

  const cutOff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();

  // cleanup non-manjaro links older than 30 days
  await db
    .deleteFrom("urls")
    .where((eb) =>
      eb(sql`strftime('%Y-%m-%dT%H:%M:%fZ', timestamp)`, "<", cutOff)
        .and("value", "not like", "%manjaro.org%")
        .and("value", "not like", "%manjaro.download%")
        .and("value", "not like", "%manjaro-sway.download%")
    )
    .execute();

  const { hash, plaintextSecret } = await createHash({
    plaintextSecret: crypto.randomUUID(),
    salt: context.env.SALT,
  });
  // int between 4 and 7
  const keyLength = Math.floor(Math.random() * 4) + 4;

  try {
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

    const values = {
      url: url.toString(),
      edit: editUrl.toString(),
      stats: statsUrl.toString(),
      ...result,
      secret: plaintextSecret,
    };

    const accepts = context.request.headers.get("accept").split(",");
    if (
      accepts.includes("text/html") &&
      !accepts.includes("application/json")
    ) {
      const url = new URL(context.request.url);
      url.pathname = "";
      url.search = new URLSearchParams(values).toString();
      return Response.redirect(url.toString(), 302);
    }

    return Response.json(values);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
};
