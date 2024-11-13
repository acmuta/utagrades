import React, { useState, useEffect } from "react";
import SelectionDropdowns from "./SelectionDropdowns";
import ToggleSwitch from "./ToggleSwitch";

export interface Course {
  subject_id: string;
  course_number: string;
  instructor1: string;
  section_number: string;
  semester: string;
  year: string;
  course_gpa: string;
  grades_count: number;
  grades_A: number;
  grades_B: number;
  grades_C: number;
  grades_D: number;
  grades_F: number;
  grades_I: number;
  grades_P: number;
  grades_Q: number;
  grades_W: number;
  grades_Z: number;
  grades_R: number;
}

interface SideBarProps {
  professors: string[];
  selectedProfessor?: string;
  setSelectedProfessor: (professor?: string) => void;
  years: string[];
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  selectedCourse?: string;
  setSelectedCourse: (course?: string) => void;
  coursesToDisplay: Course[];
  semesters: string[];
  selectedSemester: string | null;
  setSelectedSemester: (semester: string | null) => void;
  finalFilteredCourses: Course[];
  selectedSection: Course | null;
  setSelectedSection: (section: Course | null) => void;
  routeType: "course" | "professor" | null;
  selectedItems: Map<string, Course | null>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Map<string, Course | null>>>;
}

const SideBar: React.FC<SideBarProps> = ({
  professors,
  selectedProfessor,
  setSelectedProfessor,
  years,
  selectedYear,
  setSelectedYear,
  selectedCourse,
  setSelectedCourse,
  coursesToDisplay,
  semesters,
  selectedSemester,
  setSelectedSemester,
  finalFilteredCourses,
  selectedSection,
  setSelectedSection,
  routeType,
  selectedItems,
  setSelectedItems,
}) => {
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);
  const [checkboxEnabled, setCheckboxEnabled] = useState(false);

  // State to store the checkbox states
  const [checkboxState, setCheckboxState] = useState<Map<string, boolean>>(new Map());

  // State to track if selections are complete for each professor/course
  const [isSelectionComplete, setIsSelectionComplete] = useState<Map<string, boolean>>(new Map());

  // Handle toggle switch change
  const handleToggleChange = (enabled: boolean) => {
    setCheckboxEnabled(enabled);
    setSelectedItems(new Map());
    setCheckboxState(new Map());
  };

  // Function to handle checkbox state
  const handleCheckboxChange = (isChecked: boolean, key: string) => {
    if (isChecked) {
      if (selectedItems.size >= 3) {
        alert("You can only select up to 3 for comparison.");
        return;
      }
      const selectionsComplete = isSelectionComplete.get(key) || false;
      setSelectedItems((prevMap) => new Map(prevMap).set(key, selectionsComplete ? selectedSection : null));
    } else {
      setSelectedItems((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(key);
        return newMap;
      });
    }
    setCheckboxState((prevMap) => new Map(prevMap).set(key, isChecked));
  };

  // Effect to update selection completeness
  useEffect(() => {
    const key = routeType === "course" ? selectedProfessor : selectedCourse;
    if (key) {
      const allSelectionsMade = !!selectedYear && !!selectedSemester && !!selectedSection;
      setIsSelectionComplete((prevMap) => new Map(prevMap).set(key, allSelectionsMade));

      if (checkboxState.get(key) && allSelectionsMade) {
        setSelectedItems((prevMap) => new Map(prevMap).set(key, selectedSection));
      }
    }
  }, [
    selectedYear,
    selectedSemester,
    selectedSection,
    selectedProfessor,
    selectedCourse,
    checkboxState,
    routeType,
    setSelectedItems,
  ]);

  const toggleAccordion = (index: number, key: string) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
    if (routeType === "course") {
      setSelectedProfessor(key);
    } else {
      setSelectedCourse(key);
    }
  };

  return (
    <div className="flex flex-col lg:w-1/3 w-full mx-auto pr-2 mt-4 mr-4 lg:mt-10 bg-gray-200 bg-opacity-10 rounded-lg p-2 lg:p-4 min-w-[320px]">
      {routeType === "course" && (
        <div className="flex items-center mb-4 mt-2 lg:mb-4">
          <span className="mr-5 text-white text-sm lg:text-base">Compare professors</span>
          <ToggleSwitch isEnabled={checkboxEnabled} onToggle={handleToggleChange} />
        </div>
      )}

      {routeType === "course" ? (
        <ul className="space-y-2 lg:space-y-4">
          {professors.map((professor, index) => {
            const isOpen = openAccordionIndex === index;
            return (
              <li
                key={professor}
                className="p-4 rounded-lg shadow-sm bg-gray-200 bg-opacity-10"
              >
                <div className="flex items-center">
                  {checkboxEnabled && (
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={checkboxState.get(professor) || false}
                      onChange={(e) => handleCheckboxChange(e.target.checked, professor)}
                    />
                  )}
                  <div
                    className="flex justify-between items-center flex-1 cursor-pointer"
                    onClick={() => toggleAccordion(index, professor)}
                  >
                    <h2 className="text-sm lg:text-lg font-semibold text-white">{professor}</h2>
                    <span className="text-gray-300">{isOpen ? "-" : "+"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div
                    className="mt-2 bg-gray-200 bg-opacity-10 p-2 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectionDropdowns
                      selectedProfessor={professor}
                      selectedCourseSubject={null}
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                      selectedSemester={selectedSemester}
                      setSelectedSemester={setSelectedSemester}
                      finalFilteredCourses={finalFilteredCourses}
                      selectedCourse={selectedCourse || ""}
                      selectedSection={selectedSection}
                      setSelectedSection={setSelectedSection}
                      years={years}
                      semesters={semesters}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : routeType === "professor" ? (
        <ul className="space-y-4">
          {coursesToDisplay.map((course, index) => {
            const courseKey = `${course.subject_id} ${course.course_number}`;
            const isOpen = openAccordionIndex === index;
            return (
              <li
                key={courseKey}
                className="p-4 rounded-lg shadow-sm bg-gray-200 bg-opacity-10"
              >
                <div className="flex items-center">
                  <div
                    className="flex justify-between items-center flex-1 cursor-pointer"
                    onClick={() => toggleAccordion(index, courseKey)}
                  >
                    <h2 className="text-lg font-semibold text-white">{courseKey}</h2>
                    <span className="text-gray-300">{isOpen ? "-" : "+"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div
                    className="mt-4 bg-gray-200 bg-opacity-10 p-4 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectionDropdowns
                      selectedProfessor={course.instructor1}
                      selectedCourseSubject={course.subject_id}
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                      selectedSemester={selectedSemester}
                      setSelectedSemester={setSelectedSemester}
                      finalFilteredCourses={finalFilteredCourses}
                      selectedCourse={courseKey}
                      selectedSection={selectedSection}
                      setSelectedSection={setSelectedSection}
                      years={years}
                      semesters={semesters}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default SideBar;
