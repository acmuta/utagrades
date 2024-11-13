"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";

interface Suggestion {
  suggestion: string;
  type: "professor" | "course";
}

interface SearchBarProps {
  initialValue?: string;
  resetState?: () => void;
  course?: string;
  professor?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = "",
  resetState,
  course,
  professor,
}) => {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced fetchSuggestions function
  const fetchSuggestions = useRef(
    debounce(async (input: string) => {
      if (input.length > 1) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/courses/search?query=${input}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300) // Debounce time increased to reduce backend calls
  ).current;

  useEffect(() => {
    return () => {
      fetchSuggestions.cancel(); // Clean up on unmount
    };
  }, [fetchSuggestions]);

  useEffect(() => {
    setSearchInput(initialValue);
  }, [initialValue]);

  const handleSearch = (query: string) => {
    setSearchInput(query);
    setSuggestions([]);

    if (!(course === query || professor === query)) {
      resetState && resetState();
    }

    // Find the suggestion type
    const suggestionItem = suggestions.find((s) => s.suggestion === query);
    const isProfessor = suggestionItem?.type === "professor";

    if (isProfessor) {
      router.push(`/results?professor=${encodeURIComponent(query)}`);
    } else {
      router.push(`/results?course=${encodeURIComponent(query)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchInput(input);
    fetchSuggestions(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (suggestions.length > 0) {
        handleSearch(suggestions[0].suggestion);
      } else {
        handleSearch(searchInput);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
    inputRef.current?.blur(); // Remove focus from input after selection
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a course or professor"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full p-3 pr-10 border border-gray-500 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 bg-white bg-opacity-10 text-white"
        />
        <FaSearch
          onClick={() => handleSearch(searchInput)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300 w-4 h-4"
        />
      </div>
      {isLoading && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 text-black px-4 py-2">
          Loading...
        </div>
      )}
      {suggestions.length > 0 && !isLoading && (
        <ul className="absolute w-full max-h-60 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.suggestion)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-black"
            >
              {suggestion.suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
