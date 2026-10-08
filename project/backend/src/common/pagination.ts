export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; perPage: number; totalPages: number };
}

export function parsePagination(query: Record<string, unknown>): { page: number; perPage: number } {
  const page = Math.max(1, Number(query?.['page'] ?? 1) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query?.['perPage'] ?? query?.['limit'] ?? 20) || 20));
  return { page, perPage };
}

export function paginate<T>(items: T[], page: number, perPage: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: { total, page: safePage, perPage, totalPages },
  };
}
