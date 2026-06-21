import type { BenchmarkRepository } from "@/lib/repo/Repository";
import { SeedRepository } from "@/lib/repo/SeedRepository";
import { SupabaseRepository } from "@/lib/repo/SupabaseRepository";

export function getRepository(): BenchmarkRepository {
  const useSupabase =
    process.env.USE_SUPABASE === "true" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return useSupabase ? new SupabaseRepository() : new SeedRepository();
}
