// src/api/tmdb.ts
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

/**
 * Search movies by title
 */
export async function searchMovies(query: string, page: number = 1, filters: { genre?: string; year?: number }) {
  try {
    const params: any = {
      api_key: API_KEY,
      language: "en-US",
      page,
    };

    if (query) params.query = query;

    if (filters.genre) params.with_genres = filters.genre;
    if (filters.year) params.primary_release_year = filters.year;

    // Decide endpoint based on whether query exists
    const endpoint = query ? "/search/movie" : "/discover/movie";

    const response = await api.get(endpoint, { params });
    return response.data.results || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}


/**
 * Get full movie details by ID
 */
export async function getMovieDetails(movieId: number) {
  try {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

/**
 * Get credits (cast + crew) for a movie
 */
export async function getMovieCredits(movieId: number) {
  try {
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
}

/**
 * Get recommended movies based on a movie ID
 */
export async function getRecommendedMovies(movieId: number) {
  try {
    const response = await api.get(`/movie/${movieId}/recommendations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
    throw error;
  }
}

/**
 * Utility: Get TMDB image URL
 */
export function getImageUrl(path: string, size: string = "w500") {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Utility: Get TMDB backdrop URL
 */
export function getBackdropUrl(path: string, size: string = "original") {
  if (!path) return "/placeholder-backdrop.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
