import { eq } from "drizzle-orm";
import { db } from "../client";
import { agentSeats } from "../schema";

export type AgentSeatRow = typeof agentSeats.$inferSelect;
export type NewAgentSeatRow = typeof agentSeats.$inferInsert;

// Phase 2 Step 1 repository skeleton. UI integration starts in a later step.
export async function listAgentSeats(): Promise<AgentSeatRow[]> {
  return db.select().from(agentSeats).all();
}

export async function getAgentSeatById(id: string): Promise<AgentSeatRow | undefined> {
  return db.select().from(agentSeats).where(eq(agentSeats.id, id)).get();
}

export async function insertAgentSeat(agentSeat: NewAgentSeatRow): Promise<void> {
  db.insert(agentSeats).values(agentSeat).run();
}

export async function upsertAgentSeat(agentSeat: NewAgentSeatRow): Promise<void> {
  db.insert(agentSeats).values(agentSeat).onConflictDoUpdate({
    target: agentSeats.id,
    set: {
      name: agentSeat.name,
      agentType: agentSeat.agentType,
      status: agentSeat.status,
      currentTaskId: agentSeat.currentTaskId,
      currentProjectId: agentSeat.currentProjectId,
      focus: agentSeat.focus,
      updatedAt: agentSeat.updatedAt,
    },
  }).run();
}

export async function updateAgentSeat(id: string, changes: Partial<Omit<NewAgentSeatRow, "id" | "createdAt">>): Promise<void> {
  db.update(agentSeats).set(changes).where(eq(agentSeats.id, id)).run();
}

export async function deleteAgentSeat(id: string): Promise<void> {
  db.delete(agentSeats).where(eq(agentSeats.id, id)).run();
}
