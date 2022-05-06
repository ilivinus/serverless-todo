export default {
  type: "object",
  properties: {
    id: { type: "string" },
    completed: { type: "boolean" },
  },
  required: ["completed", "id"],
} as const;
// id: string<uuid>, label: string, completed: boolean, createdAt: string<date>, updatedAt: string<date>
