import { getDB, type Env } from "./utils";

export const onRequest: PagesFunction<Env> = async (context) => {
  const cache = caches.default;
  const cachedResponse = await cache.match(context.request);

  if (cachedResponse) {
    console.info("cache hit");
    return cachedResponse;
  }

  const db = getDB(context.env);

  const result = await db
    .selectFrom("urls")
    .select(({ fn }) => [fn.count<number>("key").as("links"), fn.sum<number>("count").as("redirects")])
    .executeTakeFirst();

  const statsUrl = new URL(context.request.url);
  statsUrl.pathname = `/stats`;
  statsUrl.search = "";

  const response = Response.json(
    {
      ...result,
      redirects_badge: `https://img.shields.io/badge/dynamic/json?url=${encodeURIComponent(
        statsUrl.toString()
      )}&query=%24.redirects&label=redirects`,
      links_badge: `https://img.shields.io/badge/dynamic/json?url=${encodeURIComponent(
        statsUrl.toString()
      )}&query=%24.links&label=links`,
    },
    {
      headers: {
        expires: new Date(Date.now() + 60 * 1000 * 10).toUTCString(),
      },
    }
  );

  cache.put(context.request, response.clone());

  return response;
};
