import z from "zod";
import { createHash, getDB, paramsValidator, type Env } from "../utils";
import { sql } from "kysely";

const queryValidator = z.object({
  url: z.string().url(),
  secret: z.string().uuid(),
});

export const onRequest: PagesFunction<Env> = async (context) => {
  const cache = caches.default;
  const response = await cache.match(context.request);

  if (response) {
    console.info("cache hit");
    return response;
  }

  const db = getDB(context.env);

  const params = paramsValidator.safeParse(context.params);
  const query = queryValidator.safeParse(
    Object.fromEntries(new URL(context.request.url).searchParams)
  );

  if (!params.success) {
    return Response.json(params.error, { status: 400 });
  }

  if (!query.success) {
    return Response.json(query.error, { status: 400 });
  }

  const { key } = params.data;
  const { url: value, secret } = query.data;

  const { hash } = await createHash({
    plaintextSecret: secret,
    salt: context.env.SALT,
  });

  const result = await db
    .updateTable("urls")
    .where("key", "=", key)
    .where("secret", "=", hash)
    .set({ value, timestamp: sql`CURRENT_TIMESTAMP` })
    .returning(["key", "timestamp", "value"])
    .executeTakeFirst();

  if (!result) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(context.request.url);
  url.pathname = result.key;
  url.search = "";

  return Response.json({ url, ...result, secret });
};
