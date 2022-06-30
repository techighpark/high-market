import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
}

const client =
  global.client || new PrismaClient({ log: ["info", "warn", "error"] });

if (process.env.NODE_ENV === "development") global.client = client;
console.log(global.client);
console.log(client);

export default client;
