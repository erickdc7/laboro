export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `Hace ${Math.max(diffMinutes, 1)} min`;
  }
  if (diffHours < 24) {
    return `Hace ${diffHours}h`;
  }
  if (diffDays === 1) {
    return "Ayer";
  }
  if (diffDays <= 5) {
    return `Hace ${diffDays} días`;
  }
  return "Hace más de 5 días";
}

export function isNew(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return now.getTime() - date.getTime() < 1000 * 60 * 60 * 24;
}