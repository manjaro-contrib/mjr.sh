import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import z from "zod";

export const paramsValidator = z.object({
  key: z.string().min(3).max(6),
});

export type Env = {
  urls: D1Database;
  SALT: string;
};

type Table = {
  key: string;
  value: string;
  count: number;
  secret: string;
  timestamp: string;
  domain: string;
};

interface Database {
  urls: Table;
}

export const getDB = (env: Env) => {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: env.urls }),
  });
};

const encoder = new TextEncoder();

export const createHash = async ({
  plaintextSecret,
  salt,
}: {
  plaintextSecret: string;
  salt: string;
}) => {
  const secret = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`${plaintextSecret}${salt}`)
  );
  const hashBuffer = new Uint8Array(secret);
  const hashArray = Array.from(hashBuffer);
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return { plaintextSecret, hash };
};
