import { supabase, isSupabaseConfigured } from "./supabase";
import { destinations as mockDestinations, Destination } from "@/data/destinations";

export async function fetchDestinations(): Promise<Destination[]> {
  if (!isSupabaseConfigured) {
    console.log("[DataService] Supabase credentials not found. Serving mock journal data.");
    return mockDestinations;
  }

  try {
    // Query destinations with nested culinary highlights and lessons
    const { data, error } = await supabase!
      .from("destinations")
      .select(`
        id,
        name,
        country,
        lat,
        lng,
        coordinates,
        quote,
        description,
        status,
        culinary_highlights (
          dish,
          description,
          category
        ),
        lessons (
          lesson
        )
      `)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[DataService] Supabase SELECT query error:", error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn("[DataService] Supabase tables returned empty. Falling back to mock data.");
      return mockDestinations;
    }

    // Map the relational Supabase response format to the Destination interface structure
    return data.map((dest: any) => ({
      id: dest.id,
      name: dest.name,
      country: dest.country,
      lat: dest.lat,
      lng: dest.lng,
      coordinates: dest.coordinates,
      quote: dest.quote,
      description: dest.description,
      status: dest.status,
      culinaryHighlights: (dest.culinary_highlights || []).map((h: any) => ({
        dish: h.dish,
        description: h.description,
        category: h.category
      })),
      lessonsLearned: (dest.lessons || []).map((l: any) => l.lesson)
    }));
  } catch (error) {
    console.error("[DataService] Database request failed. Falling back to mock data:", error);
    return mockDestinations;
  }
}
