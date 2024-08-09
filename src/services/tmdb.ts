import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  throw new Error("TMDB API key is not defined in environment variables");
}

if (!ACCESS_TOKEN) {
  throw new Error("TMDB access token is not defined in environment variables");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await api.get("/movie/popular", {
      params: { page, api_key: API_KEY },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await api.get("/search/movie", {
      params: { query, page, api_key: API_KEY },
    });
    const movies = response.data.results;

    // Fetch genre information for each movie
    const moviesWithGenres = await Promise.all(
      movies.map(async (movie: any) => {
        const details = await getMovieDetails(movie.id);
        return { ...movie, genres: details.genres };
      })
    );

    return moviesWithGenres;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: { api_key: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export interface MovieFilterParams {
  MinRating?: string;
  MaxRating?: string;
  MinYear?: string;
  MaxYear?: string;
  Genre?: string;
  OriginalLanguage?: string;
  Limit?: string;
}

export const filterMovies = async (filters: MovieFilterParams) => {
  try {
    const params: any = { api_key: API_KEY, language: "en-US" };

    if (filters.MinRating) params["vote_average.gte"] = filters.MinRating;
    if (filters.MaxRating) params["vote_average.lte"] = filters.MaxRating;
    if (filters.MinYear)
      params["primary_release_date.gte"] = `${filters.MinYear}-01-01`;
    if (filters.MaxYear)
      params["primary_release_date.lte"] = `${filters.MaxYear}-12-31`;
    if (filters.Genre) params.with_genres = filters.Genre;
    if (filters.OriginalLanguage)
      params.with_original_language = filters.OriginalLanguage;

    const response = await api.get("/discover/movie", { params });
    return response.data.results;
  } catch (error) {
    console.error("Error filtering movies:", error);
    throw error;
  }
};
