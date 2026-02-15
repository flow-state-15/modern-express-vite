// Shared test teardown — closes DB connections so Jest exits cleanly.

import { prisma } from "../src/utils/db.js";
import { closeSessionStore } from "../src/middleware/index.js";

export async function teardownAll(): Promise<void> {
  closeSessionStore();
  await prisma.$disconnect();
}
