export const ERA_COLORS = {
  ancient_rome: "#b8543d",
  medieval: "#3d8a8a",
  renaissance: "#c9a961",
  baroque: "#7a5cc4",
  unification: "#6a8a4d",
  fascism: "#4a4a4a",
  postwar: "#a26a44",
  contemporary: "#888888",
} as const;

export type EraId = keyof typeof ERA_COLORS;

export function eraColor(id: EraId): string {
  return ERA_COLORS[id] ?? ERA_COLORS.contemporary;
}

export function eraColorFaded(id: EraId, alpha: number): string {
  const hex = eraColor(id).slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
