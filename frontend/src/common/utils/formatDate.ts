
export function formatDate(date: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}