export function isOctober(date = new Date()): boolean {
  return date.getMonth() === 9; // 0-indexed
}

export function seasonalBoost(tags: string[] | undefined, date = new Date()): number {
  if (!isOctober(date)) return 0;
  const t = (tags || []).map((x) => x.toLowerCase());
  const boostTags = ["haunted", "ghost", "halloween", "fall-colors"]; 
  return boostTags.reduce((acc, b) => (t.includes(b) ? acc + 1 : acc), 0);
}


