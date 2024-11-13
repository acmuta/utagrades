import { useState, useEffect, useRef } from "react";
import BarChart from "./BarChart";
import { GradesInfoCard } from "./GradesInfoCard";

// Map Tailwind CSS classes to hex codes if needed
const tailwindColors: { [key: string]: string } = {
   "border-t-blue-400": "#60A5FA",
   "border-t-green-400": "#34D399",
   "border-t-orange-400": "#FBBF24",
   "border-t-teal-400": "#2DD4BF",
   "border-t-rose-400": "#FB7185",
   "border-t-yellow-400": "#FDE047",
   // Add more mappings if necessary
};

const StatsCard = ({ selectedItems }: { selectedItems: Map<string, any> }) => {
   const [showInfoBox, setShowInfoBox] = useState(false);
   const infoBoxRef = useRef<HTMLDivElement | null>(null);
   const buttonRef = useRef<HTMLButtonElement | null>(null);
   const aggregatedData = Array.from(selectedItems.values());

   const colorClasses = [
      "border-t-blue-400",
      "border-t-green-400",
      "border-t-orange-400",
      "border-t-teal-400",
      "border-t-rose-400",
      "border-t-yellow-400",
   ];

   // Determine the line color (use the first color class or a default)
   const lineColor =
      tailwindColors[colorClasses[0]] || colorClasses[0] || "#57D2DD";

   const InfoBox = ({
      label,
      value,
      colorClass,
   }: {
      label: string;
      value: string | number;
      colorClass: string;
   }) => {
      // Map the color class to its hex code for text color
      const textColor = tailwindColors[colorClass] || "#FFFFFF";

      return (
         <div
            className={`flex flex-col bg-gray-200 bg-opacity-10 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClass} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
         >
            <span className="text-white text-xs sm:text-base">{label}</span>
            <span className="text-sm sm:text-lg" style={{ color: textColor }}>
               {value}
            </span>
         </div>
      );
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            showInfoBox &&
            infoBoxRef.current &&
            !infoBoxRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
         ) {
            setShowInfoBox(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [showInfoBox]);

   return (
      <div className="w-full lg:w-2/3 mt-10 mx-auto relative">
         {aggregatedData.length > 0 && aggregatedData[0] ? (
            <div className="flex flex-col p-4 rounded-lg shadow-md h-full gap-4 bg-gray-200 bg-opacity-10 mb-6 relative">
               {/* Info Button */}
               <button
                  ref={buttonRef}
                  className="absolute top-4 right-4 text-white bg-gray-400 bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center font-bold z-20"
                  title="Info"
                  onClick={() => setShowInfoBox((prev) => !prev)}
                  // style={{ backgroundColor: lineColor }}
               >
                  i
               </button>
               {/* Info Box Modal */}
               {showInfoBox && (
                  <div
                     ref={infoBoxRef}
                     className="absolute top-12 right-4 bg-gray-500 p-4 rounded-lg shadow-lg w-72 border border-gray-300 z-10"
                  >
                     <GradesInfoCard />
                  </div>
               )}
               <h2 className="text-2xl sm:text-3xl mt-4 font-extrabold mb-1 text-center text-white drop-shadow-md">
                  {aggregatedData[0]?.subject_id &&
                  aggregatedData[0]?.course_number
                     ? `${aggregatedData[0].subject_id} ${aggregatedData[0].course_number}`
                     : "Course Information"}
               </h2>
               <div className="border-b-4 rounded border-gray-500 w-1/2 mx-auto mb-3 px-10"></div>{" "}
               {/* Render differently depending on the number of items */}
               {aggregatedData.length === 1 ? (
                  <div className="flex flex-col gap-4 mr-0.5 ml-0.5">
                     <div className="flex flex-row gap-4 justify-evenly">
                        {aggregatedData[0]?.instructor1 && (
                           <InfoBox
                              label="PROFESSOR"
                              value={aggregatedData[0].instructor1}
                              colorClass={colorClasses[0]}
                           />
                        )}
                        {aggregatedData[0]?.year && (
                           <InfoBox
                              label="SECTION"
                              value={`${aggregatedData[0].semester} ${aggregatedData[0].year}-${aggregatedData[0]?.section_number}`}
                              colorClass={colorClasses[1]}
                           />
                        )}
                        {aggregatedData[0]?.grades_count && (
                           <InfoBox
                              label="TOTAL STUDENTS"
                              value={aggregatedData[0].grades_count}
                              colorClass={colorClasses[2]}
                           />
                        )}
                     </div>
                     <div className="flex flex-row gap-4 justify-evenly">
                        {aggregatedData[0]?.section_number && (
                           <InfoBox
                              label="PASS RATE"
                              value={`${Math.ceil(
                                 ((Number(aggregatedData[0].grades_A) +
                                    Number(aggregatedData[0].grades_B) +
                                    Number(aggregatedData[0].grades_C) + 
                                    Number(aggregatedData[0].grades_P)) /
                                    Number(aggregatedData[0].grades_count)) *
                                    100
                              )}%`}
                              colorClass={colorClasses[3]}
                           />
                        )}
                        {aggregatedData[0]?.course_gpa && (
                           <InfoBox
                              label="AVERAGE GRADE"
                              value={
                                 Math.floor(aggregatedData[0].course_gpa * 25) +
                                 `%`
                              }
                              colorClass={colorClasses[4]}
                           />
                        )}
                        {aggregatedData[0]?.grades_count && (
                           <InfoBox
                              label="WITHDRAWAL RATE"
                              value={`${Math.ceil(
                                 (Number(aggregatedData[0].grades_W) /
                                    Number(aggregatedData[0].grades_count)) *
                                    100
                              )}%`}
                              colorClass={colorClasses[5]}
                           />
                        )}
                     </div>
                  </div>
               ) : ( 
                  // Multiple items, display as lines
                  aggregatedData.map((sectionData, index) => {
                     const colorClass =
                        colorClasses[index % colorClasses.length];
                     return (
                        <div
                           key={index}
                           className={`flex flex-col sm:flex-row justify-center sm:-mr-20 gap-1 bg-opacity-10 hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
                        >
                           <div className="lg:ml-14 md:ml-14 w-full flex flex-row gap-2 justify-center">
                           {sectionData?.instructor1 && (
                              <InfoBox
                                 label="PROFESSOR"
                                 value={sectionData.instructor1}
                                 colorClass={colorClass}
                              />
                           )}
                           {sectionData?.year && (
                              <InfoBox
                                 label="SECTION"
                                 value={`${sectionData.semester} ${sectionData.year}-${sectionData.section_number}`}
                                 colorClass={colorClass}
                              />
                           )}
                           {sectionData?.grades_count && (
                              <InfoBox
                                 label="TOTAL STUDENTS"
                                 value={sectionData.grades_count}
                                 colorClass={colorClass}
                              />
                           )}
                           </div>
                           <div className="w-full flex flex-row gap-2 justify-center sm:justify-normal sm:ml-1">
                           {sectionData?.section_number && (
                              <InfoBox
                                 label="PASS RATE"
                                 value={`${Math.ceil(
                                    ((Number(sectionData.grades_A) +
                                       Number(sectionData.grades_B) +
                                       Number(sectionData.grades_C)) /
                                       Number(sectionData.grades_count)) *
                                       100
                                 )}%`}
                                 colorClass={colorClass}
                              />
                           )}
                           {sectionData?.course_gpa && (
                              <InfoBox
                                 label="AVERAGE GRADE"
                                 value={`${Math.floor(
                                    sectionData.course_gpa * 25
                                 )}%`}
                                 colorClass={colorClass}
                              />
                           )}
                           </div>
                        </div>
                     );
                  })
               )}
               {/* Pass the grades and colors to the BarChart */}
               <BarChart grades={aggregatedData} colors={colorClasses} />
            </div>
         ) : (
            <div className="bg-gray-200 bg-opacity-10 rounded-lg shadow-md p-4 m-4 text-center">
               <p className="text-white">
                  Select a professor or course to see more information.
               </p>
            </div>
         )}
      </div>
   );
};

export default StatsCard;
