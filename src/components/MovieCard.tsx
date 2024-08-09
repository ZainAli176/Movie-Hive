import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string | null;
  genre: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  year,
  rating,
  poster,
  genre,
}) => {
  const posterUrl = poster
    ? `https://image.tmdb.org/t/p/w500${poster}`
    : "/default-poster.jpg";

  return (
    <Link href={`/movie/${id}`} passHref>
      <Card className="w-64">
        <CardContent className="p-0">
          <div className="relative w-full h-96">
            <Image
              src={posterUrl}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{year}</p>
          <div className="flex justify-between w-full mt-2">
            <Badge variant="secondary">{rating.toFixed(1)}/10</Badge>
            <Badge>{genre}</Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MovieCard;
