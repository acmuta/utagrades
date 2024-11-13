import React from "react";

interface GradeInfo {
  grade: string;
  description: string;
}

export const GradesInfoCard: React.FC = () => {
  const grades: GradeInfo[] = [
    { grade: "A", description: "Excellent" },
    { grade: "B", description: "Good" },
    { grade: "C", description: "Fair" },
    { grade: "D", description: "Passing, Below Average" },
    { grade: "F", description: "Failure" },
    { grade: "I", description: "Incomplete" },
    { grade: "W", description: "Withdrawn" },
    { grade: "Q", description: "Withdrawn - No Penalty" },
    { grade: "P", description: "Pass" },
    { grade: "R", description: "Research" },
    { grade: "Z", description: "No Credit" },
  ];

  return (
    <section aria-labelledby="grading-info-heading">
      <h3
        id="grading-info-heading"
        className="text-lg font-bold mb-2 text-blue-400"
      >
        Grading Information
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white">
          <caption className="sr-only">Grading Information Table</caption>
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-2" scope="col">
                Grade
              </th>
              <th className="pb-2" scope="col">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((item, index) => (
              <tr
                key={item.grade}
                className={`border-b border-gray-700 last:border-none ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                <td className="py-2 px-2">{item.grade}</td>
                <td className="py-2 px-2">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
