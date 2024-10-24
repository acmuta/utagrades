"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import BarChart from '../components/BarChart';
import SideBar, { Course } from '../components/SideBar';
import { IoHomeOutline } from 'react-icons/io5';
import {Poppins, Montserrat} from 'next/font/google';
// import Image from "next/image";


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], 
  variable: '--font-poppins',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
});

//TODO: Fix routing from course to itself, or professor to itself. Ex: clicking on search suggestion Jack Poe from /results?professor=Jack%20Poe
const ResultsContent = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get('course');
  const professor = searchParams.get('professor');
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesToDisplay, setCoursesToDisplay] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<Course | null>(null); 
  const [routeType, setRouteType] = useState<"course" | "professor" | null>(null); 
  
  
  const fetchCourses = async () => {
    setLoading(true);
    try {
      let data: Course[]= [];
      
      if (course) {
        const response = await fetch(`/api/courses/search?course=${encodeURIComponent(course)}`);
        const data = await response.json();
        setRouteType("course");
        setSelectedCourse(course);
        setCourses(data);
      } else if (professor) {
        const response = await fetch(`/api/courses/search?professor=${encodeURIComponent(professor)}`);
        const data = await response.json();
        setSelectedProfessor(professor)
        const filteredCourses = data.filter((course: Course) => {
          const matchesProfessor = selectedProfessor ? course.instructor1 === selectedProfessor : true;
          const matchesCourse = selectedCourse ? course.subject_id === selectedCourse : true;
          return matchesProfessor && matchesCourse;
        });
        
        const uniqueFilteredCourses = filteredCourses.reduce((acc: Course[], course: Course) => {
          const identifier = `${course.subject_id}-${course.course_number}`;
          if (!acc.some((c: Course) => `${c.subject_id}-${c.course_number}` === identifier)) {
            acc.push(course);
          }
          return acc;
        }, []);

        setRouteType("professor");
        setCourses(filteredCourses);
        setCoursesToDisplay(uniqueFilteredCourses);
      }
      
      setSelectedYear(null);
      setSelectedSemester(null);
      
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(selectedProfessor, selectedCourse, selectedYear, selectedSemester, selectedSection)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
    if ((course && course !== selectedCourse) || (professor && professor !== selectedProfessor)) {
      setLoading(true);
      fetchCourses();
    }
  }, 100);
    return () => clearTimeout(delayDebounceFn);
  }, [course, professor, selectedCourse, selectedProfessor]);

  const [subjectId, courseNumber] = selectedCourse ? selectedCourse.split(" ") : [null, null];
  const professors = [...new Set(courses.map(course => course.instructor1))];
  const filteredCourses = selectedProfessor
    ? courses.filter(course => course.instructor1 === selectedProfessor)
    : [];
    const years = [...new Set(
      filteredCourses
          .filter(course => 
              !selectedCourse || // Allow all courses if no course is selected yet
              (course.subject_id === subjectId && 
               course.course_number === courseNumber)
          )
          .map(course => course.year)
          .sort((a:any , b:any) => b - a) // Sort years in descending order
  )];
  const semesters = [...new Set(
    filteredCourses
        .filter(course => 
            !selectedCourse || // Allow all courses if no course is selected yet
            (course.subject_id === subjectId && 
             course.course_number === courseNumber &&
             course.year === selectedYear
            )
        )
        .map(course => course.semester)
  )];

  const finalFilteredCourses = filteredCourses
  .filter(course => {
    const matchesCourse = selectedCourse ? 
      (() => {
        const [subjectId, courseNumber] = selectedCourse.split(" ");
        return course.subject_id === subjectId && course.course_number === courseNumber;
      })() : true;
    
    const matchesYear = selectedYear ? course.year === selectedYear : true;
    const matchesSemester = selectedSemester ? course.semester === selectedSemester : true;
    
    return matchesCourse && matchesYear && matchesSemester;
  })
  .sort((a, b) => {
    // Sort by section_number in ascending order
    return a.section_number.localeCompare(b.section_number);
  });

  const handleProfessorClick = (professor: any) => {
    setSelectedProfessor(professor);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
  };

  const resetState = () => {
    setSelectedProfessor(null);
    setSelectedCourse(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setCourses([]);
    setCoursesToDisplay([]); 
  };

  const resetProf = () => {
    setSelectedProfessor(null);
  };
  const resetCourse = () => {
    setSelectedCourse(null);
  };
  
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#003B66] via-[#2B5198] to-[#B56A2A]">
      <div className="max-w-7xl mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <IoHomeOutline
            onClick={() => (window.location.href = '/')}
            className="text-2xl cursor-pointer ml-4 mt-1 text-gray-300"
            aria-label="Home"
          />
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            {/*Pending permission from UTA to use UTA logo: <h1 className="text-2xl mb-6 tracking-wide text-center"> 
              <span className={`${poppins.className} font-black text-[#0064B1]`}>
                UT
                <span className="inline-block align-middle -mt-1">
                  <Image
                    src="/assets/UTA.png"
                    alt="UTA logo"
                    width={19}
                    height={19}
                  />
                </span>
              </span>
              <span className={`${montserrat.className} text-gray-300 ml-2`}>
                GRADES
              </span>
            </h1> */}
            <h1 className="text-2xl font-montserrat">
              <span className={`${poppins.className} font-bold text-gray-300`}>UTA</span>
              <span className={`${montserrat.className} font-normal text-gray-300`}> GRADES</span>
            </h1>
          </div>
          <div className="w-8"></div>
        </div>
        {/* SearchBar always at the top */}
        <div className="text-white">
          <SearchBar initialValue={course || ''} resetState={resetState} resetCourse={resetCourse} resetProf={resetProf} />
        </div>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : courses.length === 0 ?  (
          <p className="text-white">No results found for &quot;{course || professor}&quot;. Please try another search.</p>
        ) : (
  <div className="flex flex-col md:flex-row justify-between items-center md:items-start p-4 md:p-26">
  {/* Sidebar */}
  <SideBar
    professors={professors}
    selectedProfessor={selectedProfessor}
    setSelectedProfessor={handleProfessorClick}
    years={years}
    selectedYear={selectedYear}
    selectedCourse={selectedCourse}
    coursesToDisplay={coursesToDisplay}
    setCoursesToDisplay={setCoursesToDisplay}
    setSelectedCourse={setSelectedCourse}
    setSelectedYear={setSelectedYear}
    semesters={semesters}
    selectedSemester={selectedSemester}
    setSelectedSemester={setSelectedSemester}
    finalFilteredCourses={finalFilteredCourses}
    selectedSection={selectedSection}
    setSelectedSection={setSelectedSection}
    routeType={routeType}
  />

  {/* Right content area */}
  <div className="w-full md:w-2/3 pl-0 md:pl-4 mt-4 md:mt-10 justify-right">
    {selectedSection ? (
      <div className="flex flex-col p-4 rounded-lg shadow-md h-full gap-4 bg-gray-300 bg-opacity-30">
        <h2 className="text-2xl md:text-3xl mt-4 font-extrabold mb-4 text-center text-cyan-500 drop-shadow-md">
          {`${selectedSection.subject_id} ${selectedSection.course_number}`}
        </h2>
        <div className='flex flex-col gap-4 md:gap-6 mr-0.5 ml-0.5'>
          <div className='flex flex-col md:flex-row gap-4 justify-evenly'>
            {[
              { label: 'PROFESSOR', value: selectedSection.instructor1, borderColor: 'border-t-blue-400' },
              { label: 'YEAR', value: selectedSection.year, borderColor: 'border-t-green-400' },
              { label: 'SEMESTER', value: selectedSection.semester, borderColor: 'border-t-orange-400' },
            ].map(({ label, value, borderColor }) => (
              <div key={label} className={`flex flex-col bg-slate-100 p-3 gap-2 w-full md:w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg ${borderColor} border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300`}>
                <span>{label}</span>
                <span className='text-blue-500 text-lg'>{value}</span>
              </div>
            ))}
          </div>
          <div className='flex flex-col md:flex-row gap-4 justify-evenly'>
            {[
              { label: 'SECTION', value: selectedSection.section_number, borderColor: 'border-t-teal-400' },
              { label: 'AVERAGE GPA', value: selectedSection.course_gpa, borderColor: 'border-t-rose-400' },
              { label: 'TOTAL STUDENTS', value: selectedSection.grades_count, borderColor: 'border-t-yellow-400' },
            ].map(({ label, value, borderColor }) => (
              <div key={label} className={`flex flex-col bg-slate-100 p-3 gap-2 w-full md:w-1/3 rounded-lg font-bold hover:-translate-y-1 drop-shadow-lg ${borderColor} border-t-4 hover:drop-shadow-xl transition-transform ease-in-out duration-300`}>
                <span>{label}</span>
                <span className='text-blue-500 text-lg'>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 md:mt-8 bg-white rounded-lg">
          <BarChart grades={selectedSection} />
        </div>
      </div>
    ) : (
      <div className="bg-gray-300 bg-opacity-30 rounded-lg shadow-md p-4 m-4 text-center">
        <p className="text-white">
          {selectedProfessor 
            ? "Select a course to see more information." 
            : "Select a Professor to see more information."
          }
        </p>
      </div>
    )}
  </div>
</div>
        )}
      </div>
      <div className="bottom-0 left-0 right-0 text-center text-xs text-gray-400 p-4">
          © 2024 ACM @ UT Arlington. All rights reserved.
      </div>
    </div>
  );
  
};

// Content needs to be wrapped in a Suspense tag to avoid CSR bailout due to useSearchParams()
const ResultsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
    
  );
};

export default ResultsPage;