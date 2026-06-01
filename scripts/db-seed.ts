import { initializeLocalDb } from "@/lib/local-db/init";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

initializeLocalDb();
seedFromMockData();

console.log("Local database seeded from Phase 1 mock data");
