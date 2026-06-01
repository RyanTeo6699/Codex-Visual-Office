import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";

initializeLocalDb();

console.log(`Local database initialized at ${LOCAL_DB_PATH}`);
