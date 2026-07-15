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
 * Saves a new travel journal destination, along with its culinary highlights and lessons,
 * to the Supabase database (relational transaction insertion).
 */
export async function saveDestination(destination: Destination): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log("[DataService] Supabase not configured. Mocking successful local save.");
    return true;
  }

  try {
    // 1. Insert parent destination
    const { error: destError } = await supabase!
      .from("destinations")
      .insert({
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
      console.error("[DataService] Error inserting destination:", destError.message);
      throw destError;
    }

    // 2. Insert related culinary highlights
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

    // 3. Insert related lessons
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
    console.error("[DataService] Failed relational transaction insert to database:", error);
    return false;
  }
}
