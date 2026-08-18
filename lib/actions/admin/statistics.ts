"use server";

import { statistics } from "@/db/schema";
import { statisticSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(statistics, statisticSchema, "statistic", "/admin/content");

export async function createStatistic(input: unknown) {
  return actions.create(input);
}
export async function updateStatistic(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteStatistic(id: string) {
  return actions.remove(id);
}
export async function reorderStatistics(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
