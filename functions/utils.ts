import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import z from "zod";

export const paramsValidator = z.object({
  key: z.string().length(4),
});

export type Env = {
  urls: D1Database;
};

type Table = {
  key: string;
  value: string;
  count: number;
  secret: string;
  timestamp: string;
};

interface Database {
  urls: Table;
}

export const getDB = (env: Env) => {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: env.urls }),
  });
};
