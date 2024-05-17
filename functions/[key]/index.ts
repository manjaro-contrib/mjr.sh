import { sql } from "kysely";
import { getDB, type Env, paramsValidator } from "../utils";

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
    .executeTakeFirst();


  if (!result?.value) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await db.updateTable("urls").where("key", "=", key).set({ count: sql`count + 1` }).execute();

  const response = Response.redirect(result?.value, 301);

  return response;
};
