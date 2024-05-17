import z from "zod";
import { getDB, type Env } from "../utils";
import { sql } from "kysely";

const paramsValidator = z.object({
  secret: z.string().length(20),
});

const queryValidator = z.object({
  url: z.string().url(),
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

  const { secret } = params.data;
  const { url: value } = query.data;

  const result = await db
    .updateTable("urls")
    .where("secret", "=", secret)
    .set({ value, timestamp: sql`CURRENT_TIMESTAMP` })
    .returning(["key", "secret", "timestamp", "value"])
    .executeTakeFirst();

  if (!result) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(context.request.url);
  url.pathname = result.key;
  url.search = "";

  return Response.json({ url, ...result });
};
