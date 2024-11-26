type ItemWithId = { id: number; [key: string]: any };

/**
 * Merge function to remove duplicates based on the `id` field.
 * Ensures that the latest item in the incoming data overwrites existing ones.
 */
export const mergeById = (existing: ItemWithId[], incoming: ItemWithId[]): ItemWithId[] => {
  const map = new Map<number, ItemWithId>();

  // Add existing data to the map
  for (const item of existing) {
    map.set(item.id, item);
  }

  // Add or update with incoming data
  for (const item of incoming) {
    map.set(item.id, item);
  }

  // Return the merged list
  return Array.from(map.values());
};
