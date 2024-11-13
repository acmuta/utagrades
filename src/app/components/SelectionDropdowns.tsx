import React, { useEffect } from "react";

interface CourseSection {
  subject_id: string;
  course_number: string;
  semester: string;
  year: string;
  section_number: string;
}

interface SelectionDropdownsProps {
  selectedProfessor: string;
  selectedCourseSubject: string | null;
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  selectedSemester: string | null;
  setSelectedSemester: (semester: string | null) => void;
  finalFilteredCourses: CourseSection[];
  selectedCourse: string;
  selectedSection: CourseSection | null;
  setSelectedSection: (section: CourseSection | null) => void;
  years: string[];
  semesters: string[];
}

const SelectionDropdowns: React.FC<SelectionDropdownsProps> = ({
  selectedProfessor,
  selectedCourseSubject,
  selectedYear,
  setSelectedYear,
  selectedSemester,
  setSelectedSemester,
  finalFilteredCourses,
  selectedCourse,
  selectedSection,
  setSelectedSection,
  years,
  semesters,
}) => {
  // Set the latest year and semester when the professor or course changes
  useEffect(() => {
    if (!selectedCourse) return;

    const courseMatches = finalFilteredCourses.filter(
      (course) => `${course.subject_id} ${course.course_number}` === selectedCourse
    );

    if (courseMatches.length > 0) {
      // Sort courses to find the latest year and semester
      const sortedCourses = [...courseMatches].sort((a, b) => {
        // Compare years
        const yearDifference = parseInt(b.year) - parseInt(a.year);
        if (yearDifference !== 0) return yearDifference;

        // Compare semesters
        return semesters.indexOf(b.semester) - semesters.indexOf(a.semester);
      });

      const latestCourse = sortedCourses[0];

      // Only set year, semester, and section if not already set
      if (!selectedYear) setSelectedYear(latestCourse.year);
      if (!selectedSemester) setSelectedSemester(latestCourse.semester);
      if (!selectedSection) setSelectedSection(latestCourse);
    }
  }, [
    selectedProfessor,
    selectedCourse,
    finalFilteredCourses,
    semesters,
    selectedYear,
    selectedSemester,
    selectedSection,
    setSelectedYear,
    setSelectedSemester,
    setSelectedSection,
  ]);

  // Handlers
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setSelectedSemester(null);
    setSelectedSection(null);
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
    setSelectedSection(null);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSectionNumber = e.target.value;
    const selected = finalFilteredCourses.find(
      (course) =>
        course.section_number === selectedSectionNumber &&
        course.year === selectedYear &&
        course.semester === selectedSemester &&
        `${course.subject_id} ${course.course_number}` === selectedCourse
    );
    setSelectedSection(selected || null);
  };

  // Filtered sections based on selections
  const filteredSections = finalFilteredCourses.filter(
    (course) =>
      course.year === selectedYear &&
      course.semester === selectedSemester &&
      `${course.subject_id} ${course.course_number}` === selectedCourse
  );

  return (
    <div>
      <h2 className="text-l text-center text-white font-bold mb-4">
        {`Sections for Professor: ${selectedProfessor}`}
      </h2>
      <div className="border-b-2 rounded border-gray-400 mx-auto mb-4 px-10"></div>

      {/* Year Dropdown */}
      <div className="mb-4">
        <label htmlFor="year" className="text-white block font-semibold mb-1">
          Select Year:
        </label>
        <select
          id="year"
          value={selectedYear || ""}
          onChange={handleYearChange}
          className="border border-gray-400 bg-gray-700 bg-opacity-50 text-white p-2 rounded-lg w-full"
        >
          <option value="" disabled>
            Select a year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Semester Dropdown */}
      <div className="mb-4">
        <label htmlFor="semester" className="text-white block font-semibold mb-1">
          Select Semester:
        </label>
        <select
          id="semester"
          value={selectedSemester || ""}
          onChange={handleSemesterChange}
          className="border border-gray-400 bg-gray-700 bg-opacity-50 text-white p-2 rounded-lg w-full"
          disabled={!selectedYear}
        >
          <option value="" disabled>
            Select a semester
          </option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>

      {/* Section Dropdown */}
      {selectedYear && selectedSemester && (
        <div className="mb-4">
          <label htmlFor="section" className="block text-white font-semibold mb-1">
            Select Section:
          </label>
          <select
            id="section"
            value={selectedSection?.section_number || ""}
            onChange={handleSectionChange}
            className="border border-gray-400 bg-gray-700 bg-opacity-50 text-white p-2 rounded-lg w-full"
          >
            <option value="" disabled>
              Select a section
            </option>
            {filteredSections.map((course) => (
              <option key={course.section_number} value={course.section_number}>
                {`Section ${course.section_number}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SelectionDropdowns;
