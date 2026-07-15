import { supabase, isSupabaseConfigured } from "./supabase";
import { destinations as mockDestinations, Destination } from "@/data/destinations";

export async function fetchDestinations(): Promise<Destination[]> {
  if (!isSupabaseConfigured) {
    console.log("[DataService] Supabase credentials not found. Serving mock journal data.");
    return mockDestinations;
  }

  try {
    // Query destinations with nested culinary highlights (including heat and authenticity) and lessons
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
          category,
          heat_level,
          authenticity
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
        category: h.category,
        heatLevel: h.heat_level || 1,
        authenticity: h.authenticity || 5
      })),
      lessonsLearned: (dest.lessons || []).map((l: any) => l.lesson)
    }));
  } catch (error) {
    console.error("[DataService] Database request failed. Falling back to mock data:", error);
    return mockDestinations;
  }
}

/**
 * Saves or updates (upserts) a travel journal destination along with its culinary highlights and lessons,
 * utilizing Supabase database operations (relational cascade update).
 */
export async function saveDestination(destination: Destination): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log("[DataService] Supabase not configured. Mocking successful local save/update.");
    return true;
  }

  try {
    // 1. Upsert parent destination
    const { error: destError } = await supabase!
      .from("destinations")
      .upsert({
        id: destination.id,
        name: destination.name,
        country: destination.country,
        lat: destination.lat,
        lng: destination.lng,
        coordinates: destination.coordinates,
        quote: destination.quote,
        description: destination.description,
        status: destination.status
      });

    if (destError) {
      console.error("[DataService] Error upserting destination:", destError.message);
      throw destError;
    }

    // 2. Cascade delete existing highlights & lessons to re-insert clean, edited arrays
    const { error: delHighlightsError } = await supabase!
      .from("culinary_highlights")
      .delete()
      .eq("destination_id", destination.id);

    if (delHighlightsError) {
      console.error("[DataService] Error deleting existing highlights:", delHighlightsError.message);
    }

    const { error: delLessonsError } = await supabase!
      .from("lessons")
      .delete()
      .eq("destination_id", destination.id);

    if (delLessonsError) {
      console.error("[DataService] Error deleting existing lessons:", delLessonsError.message);
    }

    // 3. Re-insert related culinary highlights
    if (destination.culinaryHighlights && destination.culinaryHighlights.length > 0) {
      const highlightsData = destination.culinaryHighlights.map(h => ({
        destination_id: destination.id,
        dish: h.dish,
        description: h.description,
        category: h.category,
        heat_level: h.heatLevel,
        authenticity: h.authenticity
      }));

      const { error: highlightsError } = await supabase!
        .from("culinary_highlights")
        .insert(highlightsData);

      if (highlightsError) {
        console.error("[DataService] Error inserting culinary highlights:", highlightsError.message);
        throw highlightsError;
      }
    }

    // 4. Re-insert related lessons
    if (destination.lessonsLearned && destination.lessonsLearned.length > 0) {
      const lessonsData = destination.lessonsLearned.map(l => ({
        destination_id: destination.id,
        lesson: l
      }));

      const { error: lessonsError } = await supabase!
        .from("lessons")
        .insert(lessonsData);

      if (lessonsError) {
        console.error("[DataService] Error inserting lessons:", lessonsError.message);
        throw lessonsError;
      }
    }

    return true;
  } catch (error) {
    console.error("[DataService] Failed relational cascade transaction inside database:", error);
    return false;
  }
}
