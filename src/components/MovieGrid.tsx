import React from "react";
import MovieCard from "./MovieCard";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  genres?: Genre[];
}

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          year={new Date(movie.release_date).getFullYear()}
          rating={movie.vote_average}
          poster={movie.poster_path}
          genre={
            movie.genres && movie.genres.length > 0
              ? movie.genres[0].name
              : "Unknown"
          }
        />
      ))}
    </div>
  );
};

export default MovieGrid;
