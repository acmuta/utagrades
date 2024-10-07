"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import BarChart from '../components/BarChart';
import { IoHomeOutline } from "react-icons/io5";
import { Poppins, Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  weight: ['400', '600'],
  subsets: ['latin'],
});
const poppins = Poppins({
  weight: ['400', '600'],  
  subsets: ['latin'],     
});

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get('course');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // For displaying more info

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        if (course) {
          const response = await fetch(`/api/courses/search?course=${encodeURIComponent(course)}`);
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (course) {
      fetchCourses();
      setSelectedProfessor(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSection(null); // Reset section selection too
    }
  }, [course]);

  const professors = [...new Set(courses.map(course => course.instructor1))];
  const filteredCourses = selectedProfessor
    ? courses.filter(course => course.instructor1 === selectedProfessor)
    : [];
  const years = [...new Set(filteredCourses.map(course => course.year))];
  const semesters = [...new Set(filteredCourses.map(course => course.semester))];

  const finalFilteredCourses = filteredCourses.filter(course => {
    const matchesYear = selectedYear ? course.year === selectedYear : true;
    const matchesSemester = selectedSemester ? course.semester === selectedSemester : true;
    return matchesYear && matchesSemester;
  }).reduce((unique, item) => {
    return unique.some(course => course.section_number === item.section_number) ? unique : [...unique, item];
  }, []);

  const handleProfessorClick = (professor) => {
    setSelectedProfessor(professor);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <IoHomeOutline
          onClick={() => (window.location.href = '/')}
          className="text-2xl cursor-pointer ml-4 mt-1"
          aria-label="Home"
        />
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => (window.location.href = '/')}
        >
          <h1 className="text-2xl font-montserrat">
            <span className={`${poppins.className} font-bold`}>UTA</span>
            <span className={`${montserrat.className} font-normal`}> GRADES</span>
          </h1>
        </div>
        <div className="w-8"></div>
      </div>
      {/* SearchBar always at the top */}
      <SearchBar initialValue={course || ''} />

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No results found for "{course}". Please try another search.</p>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 pr-4 mt-10">
            {selectedProfessor ? (
              <div>
                <h2 className="text-lg font-semibold mb-2">{`Courses for Professor: ${selectedProfessor}`}</h2>

                {/* Year Dropdown */}
                <div className="mb-4">
                  <label htmlFor="year" className="block font-semibold mb-1">Select Year:</label>
                  <select
                    id="year"
                    value={selectedYear || ""}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                  >
                    <option value="" disabled>Select a year</option>
                    {years.map((year, index) => (
                      <option key={index} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Semester Dropdown */}
                <div className="mb-4">
                  <label htmlFor="semester" className="block font-semibold mb-1">Select Semester:</label>
                  <select
                    id="semester"
                    value={selectedSemester || ""}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                  >
                    <option value="" disabled>Select a semester</option>
                    {semesters.map((semester, index) => (
                      <option key={index} value={semester}>{semester}</option>
                    ))}
                  </select>
                </div>

                {/* Section List */}
                <ul className="space-y-2">
                  {finalFilteredCourses.map((course, index) => (
                    <li
                      key={index}
                      onClick={() => setSelectedSection(course)}
                      className={`border p-2 rounded-lg shadow-sm cursor-pointer ${selectedSection?.section_number === course.section_number ? 'bg-blue-100' : ''}`}
                    >
                      Section: {course.section_number}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setSelectedProfessor(null);
                    setSelectedYear(null);
                    setSelectedSemester(null);
                  }}
                  className="mt-4 text-blue-500 underline mr-8"
                >
                  Back to Professors
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {professors.map((professor, index) => (
                  <li
                    key={index}
                    className="border p-4 rounded-lg shadow-sm cursor-pointer"
                    onClick={() => handleProfessorClick(professor)}
                  >
                    <h2 className="text-lg font-semibold">{professor}</h2>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right content area */}
          <div className="w-2/3 pl-4 mt-16">
            {selectedSection ? (
              <div className="flex flex-col border p-4 rounded-lg shadow-md h-full gap-4">
                <h2 className="text-3xl mt-4 font-extrabold mb-4 text-center text-cyan-500 drop-shadow-md">{`${selectedSection.subject_id} ${selectedSection.course_number}`}</h2>
                {/* <p><strong>Professor:</strong> {selectedSection.instructor1}</p>
                <p><strong>Year:</strong> {selectedSection.year}</p>
                <p><strong>Semester:</strong> {selectedSection.semester}</p>
                <p><strong>Section:</strong> {selectedSection.section_number}</p>
                <p><strong>Average GPA:</strong> {selectedSection.course_gpa}</p>
                <p><strong>Total Students:</strong> {selectedSection.grades_count}</p> */}
                {<div className='flex flex-col gap-6 mr-0.5 ml-0.5'>
                    <div className='flex flex-row gap-4 justify-evenly'>
                      <p className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-blue-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                        <span className=''>PROFESSOR</span>
                        <span className='text-blue-500 text-lg'>{selectedSection.instructor1}</span>
                      </p>
                      <p className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-green-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                        <span className=''>YEAR</span>
                        <span className='text-blue-500 text-lg'>{selectedSection.year}</span>
                      </p>
                      <p className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-orange-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                        <span className=''>SEMESTER</span>
                        <span className='text-blue-500 text-lg'>{selectedSection.semester}</span>
                      </p>
                    </div>
                    <div className='flex flex-row gap-4 justify-evenly'>
                    <p className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-teal-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                        <span className=''>SECTION</span>
                        <span className='text-blue-500 text-lg'>{selectedSection.section_number}</span>
                      </p>
                      <p className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-rose-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                        <span className=''>AVERAGE GPA</span>
                        <span className='text-blue-500 text-lg'>{selectedSection.course_gpa}</span>
                      </p>
                      <p className='flex flex-col bg-slate-100 p-3 gap-2 w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg border-t-yellow-400 border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300'>
                        <span className=''>TOTAL STUDENTS</span>
                        <span className='text-blue-500 text-lg'>{selectedSection.grades_count}</span>
                      </p>
                    </div>
                </div>}

                <div className="mt-8">
                  <BarChart grades={selectedSection} />
                </div>
              </div>
            ) : (
              <p>{selectedProfessor 
                    ? "Select Year, Semester, and Section to see more information." 
                    : "Select a Professor to see more information."
                }
              </p>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
