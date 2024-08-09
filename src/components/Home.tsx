"use client";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "./ModeToggle";
import { Menu, Search } from "lucide-react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MovieGrid from "./MovieGrid";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { searchMovies } from "@/services/tmdb";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

import { useRouter } from "next/navigation";
interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  genres?: Genre[];
}

interface Genre {
  id: number;
  name: string;
}

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isAuthLoaded && !userId) {
      router.push("/sign-up");
    }
  }, [isAuthLoaded, userId, router]);

  if (!isAuthLoaded) {
    return <LoadingSpinner />;
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await searchMovies(searchQuery);
      setMovies(result);
    } catch (err) {
      setError("Failed to search movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filteredMovies: Movie[]) => {
    setMovies(filteredMovies);
  };
  if (!userId) {
    return null;
  }

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-background text-foreground">
          <header className="fixed top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center py-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <span className="text-3xl font-extrabold cursor-default">
                    🎬
                  </span>
                  <h1 className="cursor-default text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
                    Movie Hive
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search movies..."
                      className="pl-10 pr-4 py-2 rounded-full bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch}>Search</Button>
                  <ModeToggle />
                  <div className="ml-2">
                    <UserButton afterSignOutUrl="/sign-in" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 mt-16">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <MovieGrid movies={movies} />
            )}
          </main>

          {sidebarOpen && (
            <Sidebar
              onClose={() => setSidebarOpen(false)}
              onFilter={handleFilter}
            />
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Home;
