import { api } from "./api.js";

export interface CompanySearchResult {
  _id: string;
  name: string;
  slug: string;
  domain?: string;
  score: number;
}

export async function searchCompanies(
  q: string,
  domain?: string
): Promise<CompanySearchResult[]> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (domain) params.set("domain", domain);

  const res = await api.get<{ data: { results: CompanySearchResult[] } }>(
    `/companies/search?${params.toString()}`
  );
  return (res as any).data?.results ?? [];
}
