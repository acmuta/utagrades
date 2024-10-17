"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';

interface Suggestion {
  suggestion: string;
  type: string;

}
interface SearchBarProps {
  initialValue?: string;
  resetState?: () => void;
  resetProf?: () => void;
  resetCourse?: () => void;
}

export default function SearchBar({ initialValue = '' , resetState, resetCourse, resetProf }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSearchInput(initialValue); // Update input when initialValue changes
  }, [initialValue]);

  // Create a debounced version of the fetchSuggestions function
  const fetchSuggestions = useRef(
    debounce(async (input: string) => {
      if (input.length > 1) {
        setIsLoading(true); // Start loading
        try {
          const response = await fetch(`/api/courses/search?query=${input}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]); // Clear suggestions on error
        } finally {
          setIsLoading(false); // Stop loading
        }
      } else {
        setSuggestions([]);
      }
    }, 100) // Decrease the debounce time for quicker suggestion response, but might lead to more backend calls
  ).current;

  useEffect(() => {
    return () => {
      fetchSuggestions.cancel(); // Clean up on unmount
    };
  }, []);

  const handleSearch = (suggestion: string) => {
    setSearchInput(suggestion);
    setSuggestions([]);
    const isProfessor = suggestions.some(s => s.suggestion === suggestion && s.type === 'professor');
    const queryParam = isProfessor ? `professor=${encodeURIComponent(suggestion)}` : `course=${encodeURIComponent(suggestion)}`;
    
    const currentURL = new URL(window.location.href);
    const currentSearch = currentURL.searchParams.get(isProfessor ? 'professor' : 'course');
  
    if (currentSearch === suggestion) {
      if(isProfessor && resetCourse)
      {
        console.log("resetting setSelectedCourse");
        resetCourse();
      }
      else if(resetProf)
      {
        console.log("resetting setSelectedProfessor");
        resetProf();
      }
      router.replace(`/results?${queryParam}`);

    } else {
      if (resetState) {
        console.log("resetting all values");
        resetState();
      }
      router.push(`/results?${queryParam}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchInput(input);
    fetchSuggestions(input); // Call the debounced function
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search for a course or professor"
        value={searchInput}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-indigo-500 bg-white bg-opacity-30"
      />
      {isLoading && <div className="absolute w-full max-h-60 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 text-black"></div>}
      {suggestions.length > 0 && !isLoading && (
        <ul className="absolute w-full max-h-60 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 overflow-y-scroll">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSearch(suggestion.suggestion)} 
              className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-black"
            >
              {suggestion.suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
