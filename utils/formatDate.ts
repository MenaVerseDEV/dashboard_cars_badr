export function formatDateTime(date: Date): string {
  const dayOfWeek = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
  }).format(date);
  const day = new Intl.DateTimeFormat("ar-EG", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("ar-EG", { month: "long" }).format(
    date
  );
  const year = new Intl.DateTimeFormat("ar-EG", { year: "numeric" }).format(
    date
  );
  const time = new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${dayOfWeek} | ${day} ${month} ${year} | ${time}`;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) return "الآن";
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  if (diffInDays === 1) return "أمس";
  if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
  if (diffInWeeks < 4) return `منذ ${diffInWeeks} أسبوع`;
  if (diffInMonths < 12) return `منذ ${diffInMonths} شهر`;
  return `منذ ${diffInYears} سنة`;
}

export function formatDateWithTime(date: Date): {
  date: string;
  time: string;
  relative: string;
} {
  return {
    date: date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    relative: formatRelativeTime(date),
  };
}