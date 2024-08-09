"use client";
import React, { useEffect, useState } from "react";
import { getMovieDetails } from "@/services/tmdb";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  genres: { id: number; name: string }[];
  runtime: number;
}

const CardOpen: React.FC<{ movieId: string }> = ({ movieId }) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const details = await getMovieDetails(parseInt(movieId));
        setMovie(details);
      } catch (err) {
        setError("Failed to fetch movie details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg mb-4">{movie.overview}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>
          <p className="mb-2">
            <strong>Release Date:</strong>{" "}
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <p className="mb-2">
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
          </p>
          <p className="mb-2">
            <strong>Runtime:</strong> {movie.runtime} minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardOpen;
