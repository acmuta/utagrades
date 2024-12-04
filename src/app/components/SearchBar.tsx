"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";

interface Suggestion {
   suggestion: string;
   type: string;
}
interface SearchBarProps {
   initialValue?: string;
   resetState?: () => void;
   course?: string;
   professor?: string;
   routeType?: "course" | "professor" | null;
}

export default function SearchBar({
   initialValue = "",
   resetState,
   course,
   professor,
   routeType,
}: SearchBarProps) {
   const [searchInput, setSearchInput] = useState(initialValue);
   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   useEffect(() => {
      setSearchInput(initialValue); // Update input when initialValue changes
   }, [initialValue]);

   // Function to normalize the search input
   const normalizeSearchInput = (input: string) => {
      // First, check if the input matches a course pattern (letters followed by numbers)
      const coursePattern = /^[a-zA-Z]+\d+$/;
      if (coursePattern.test(input.replace(/\s+/g, ''))) {
         // Handle course code normalization
         const noSpaces = input.replace(/\s+/g, '');
         return noSpaces.replace(/([a-zA-Z]+)(\d+)/i, '$1 $2');
      }

      // For professor names, normalize spaces and handle concatenated names
      // This will handle cases like "marnimg" -> "marnim g" or "marnim g" -> "marnim g"
      const professorPattern = /^[a-zA-Z]+g$/i; // Pattern for names ending with 'g'
      if (professorPattern.test(input.replace(/\s+/g, ''))) {
         const noSpaces = input.replace(/\s+/g, '');
         return noSpaces.replace(/g$/i, ' g');
      }

      // For all other cases, just normalize spaces
      return input.replace(/\s+/g, ' ').trim();
   };

   // Create a debounced version of the fetchSuggestions function
   const fetchSuggestions = useRef(
      debounce(async (input: string) => {
         if (input.length > 0) {
            setIsLoading(true); // Start loading
            try {
               const normalizedInput = normalizeSearchInput(input);
               const response = await fetch(
                  `/api/courses/search?query=${encodeURIComponent(normalizedInput)}`
               );
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleSearch = (suggestion: string) => {
      console.log(course, suggestion);
      setSearchInput(suggestion);
      setSuggestions([]);

      /* 
         'course' contains the course subject and code e.g. "CSE 3320"
         'suggestion' contains course subject, code, and name e.g. "CSE 3320 OPERATING SYSTEMS"
         Extract the first two terms from 'suggestion' to compare against 'course' below.
      */
      const courseSuggestion = suggestion.split(" ").slice(0, 2).join(" ")

      /* 
         Do not reset the state if user searches for the content already displayed.
         e.g. If user is on the CSE 3320 page and searches for CSE 3320, do not reset
         the state as this will break the displayed results. Only reset the state if
         routing to new content. 
      */
      if (!((course == courseSuggestion && routeType === "course") || (professor === suggestion && routeType === "professor"))) {
         if (resetState) {
            resetState();
         }
      }
      // Check if the suggestion is a professor or a course
      const isProfessor = suggestions.find(
         (s) => s.suggestion === suggestion && s.type === "professor"
      );

      // Splitting the input string to extract the subject_id and course_number
      const parts = courseSuggestion.split(' '); 
      if (parts.length >= 2) {
         const coursePrefix = parts[0]; 
         const courseNumber = parts[1]; 

         // Check if the second part is a four-digit number
         if (courseNumber.length === 4 && !isNaN(Number(courseNumber))) {
               suggestion = `${coursePrefix} ${courseNumber}`;
         }
      }

      if (isProfessor) {
         router.push(`/results?professor=${encodeURIComponent(suggestion)}`); // Redirect to professor results
      } else {
         router.push(`/results?course=${encodeURIComponent(suggestion)}`); // Redirect to course results
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setSearchInput(input);
      fetchSuggestions(input); // Call the debounced function
   };

   return (
      <div className="relative w-full max-w-lg mx-auto">
         <div className="relative">
            <input
               type="text"
               placeholder="Search for a course or professor"
               value={searchInput}
               onChange={handleInputChange}
               onKeyDown={(e) => e.key === 'Enter' && suggestions.length > 0 && handleSearch(suggestions[0].suggestion)}
               className="w-full p-3 border border-gray-500 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 bg-white bg-opacity-10"
            />
            <FaSearch 
               onClick={() => suggestions.length > 0 && handleSearch(suggestions[0].suggestion)}
               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300 w-4 h-4"
            />
         </div>
         {isLoading && (
            <div className="absolute w-full max-h-60 bg-gray-200 border border-gray-500 rounded-lg mt-2 shadow-lg z-10 text-black"></div>
         )}
         {suggestions.length > 0 && !isLoading && (
            <ul className="absolute w-full max-h-60 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 overflow-y-scroll">
               {suggestions.map((suggestion, index) => (
                  <li
                     key={index}
                     onClick={() => handleSearch(suggestion.suggestion)}
                     className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-black"
                  >
                     {suggestion.suggestion}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}