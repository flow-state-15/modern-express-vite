// Prisma client singleton — import this instead of creating new instances.

import { PrismaClient } from "../../generated/prisma/client.js";

export const prisma = new PrismaClient();
