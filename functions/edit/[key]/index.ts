import z from "zod";
import { getDB, type Env } from "../../utils";

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
