import { getDB, type Env, paramsValidator } from "../utils";

export const onRequest: PagesFunction<Env> = async (context) => {
  const cache = caches.default;
  const cachedResponse = await cache.match(context.request);

  if (cachedResponse) {
    console.info("cache hit");
    return cachedResponse;
  }

  const db = getDB(context.env);

  const input = paramsValidator.safeParse(context.params);

  if (!input.success) {
    return Response.json(input.error, { status: 400 });
  }
  const { key } = input.data;

  const result = await db
    .selectFrom("urls")
    .select(["count"])
    .where("key", "=", key)
    .executeTakeFirst();

  if (result?.count == null) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const statsUrl = new URL(context.request.url);
  statsUrl.pathname = `/${key}/stats`;
  statsUrl.search = "";

  const response = Response.json(
    {
      key,
      count: result?.count,
      badge: `https://img.shields.io/badge/dynamic/json?url=${encodeURIComponent(statsUrl.toString())}&query=%24.count&label=redirects`,
    },
    {
      headers: {
        expires: new Date(Date.now() + 60 * 1000).toUTCString(),
      },
    }
  );

  cache.put(context.request, response.clone());

  return response;
};
