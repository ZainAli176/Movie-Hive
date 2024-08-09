import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterMovies, MovieFilterParams } from "@/services/tmdb";

interface SidebarProps {
  onClose: () => void;
  onFilter: (movies: any[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, onFilter }) => {
  const [filters, setFilters] = useState<MovieFilterParams>({
    MinRating: "",
    MaxRating: "",
    MinYear: "",
    MaxYear: "",
    Genre: "",
    OriginalLanguage: "",
    Limit: "30",
  });

  const handleFilterChange = (key: keyof MovieFilterParams, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    try {
      const result = await filterMovies(filters);
      onFilter(result);
      onClose();
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-y-0 left-0 w-64 bg-background text-foreground shadow-lg p-4 transform transition-transform duration-200 ease-in-out overflow-y-auto z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Rating</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.MinRating}
                onChange={(e) =>
                  handleFilterChange("MinRating", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.MaxRating}
                onChange={(e) =>
                  handleFilterChange("MaxRating", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Year</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.MinYear}
                onChange={(e) => handleFilterChange("MinYear", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.MaxYear}
                onChange={(e) => handleFilterChange("MaxYear", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Genre</label>
            <Select
              onValueChange={(value) => handleFilterChange("Genre", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="28">Action</SelectItem>
                <SelectItem value="35">Comedy</SelectItem>
                <SelectItem value="18">Drama</SelectItem>
                {/* Add more genres as needed */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Original Language
            </label>
            <Select
              onValueChange={(value) =>
                handleFilterChange("OriginalLanguage", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
