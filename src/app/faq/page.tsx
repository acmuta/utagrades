'use client';
import FAQDropdown from "../components/FAQDropdown";
import { Poppins, Montserrat } from "next/font/google";
import { IoHomeOutline } from "react-icons/io5";
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-poppins",
 });
 const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-montserrat",
 });

const FAQs = [
  {
    question: "What is MavGrades?",
    answer:
      "MavGrades is a platform that provides grade distributions for UTA courses and professors, helping students make informed class choices.",
  },
  {
    question: "Who created MavGrades?",
    answer:
      'ACM at UT Arlington! Specifically, the ACM Create committee, which is dedicated to projects just like this one! Check us out at <a href="https://acmuta.com" target="_blank" rel="noopener noreferrer" class="hover:underline text-blue-500">acmuta.com</a> !',
  },
  {
    question: "How do I use MavGrades?",
    answer:
      "Simply search for a course or professor to view the grade distribution data.",
  },
  {
    question: "How does MavGrades acquire its data?",
    answer:
      "MavGrades utilizes official grade distribution data provided by the University of Texas at Arlington (UTA). This data is regularly updated and includes information for all courses taught at UTA since 2017, ensuring that students have access to the most accurate and current information for their academic planning.",
  },
  {
    question: "Why can't I see a section or professor?",
    answer: "If a year or semester is not shown, it means that course was not offered at that time. If your professor doesn't show up, it might be their first semester at UTA! If you believe there to be an issue, please let us know."
  },
  {
    question: "How can I compare professors?",
    answer: "Search for a course, and press the \"Compare Professors\" button, then select up to 3 professors to view side by side comparisons for that course."
  },
  {
    question: "How can I provide feedback, suggestions, or report a bug?",
    answer: 'Please fill out this form for any feedback, suggestions, or to report any bugs: <a href="https://forms.gle/tAhFKDZGwN15vTUz5" target="_blank" rel="noopener noreferrer" class="hover:underline text-blue-500">MavGrades Feedback Form</a>'
  },
  {
    question: "Can I view the MavGrades source code?",
    answer: 'Definitely! View the source code here: <a href="https://github.com/acmuta/mavgrades" target="_blank" rel="noopener noreferrer" class="hover:underline text-blue-500">GitHub: acmuta/mavgrades</a>'
  }
];

const FAQPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Home Icon */}
      <div className="absolute top-6 left-6">
        <IoHomeOutline
          onClick={() => (window.location.href = "/")}
          className="text-3xl cursor-pointer text-gray-300 hover:text-gray-100 transition-colors duration-200"
          aria-label="Home"
        />
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-300">
          <span className={`${poppins.className} font-bold`}>MAV</span>
          <span className={`${montserrat.className} font-normal ml-2`}>GRADES</span>
        </h1>
      </div>

      {/* Page Title */}
      <h2 className={`${poppins.className} text-3xl font-bold text-center text-gray-300 mb-8`}>
        Frequently Asked Questions
      </h2>

      {/* FAQ Items */}
      <div className="space-y-6">
        {FAQs.map((faq, index) => (
          <FAQDropdown key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-xs text-gray-400">
        Developed by{" "}
        <a
          href="https://github.com/acmuta/mavgrades"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          ACM @ UTA
        </a>
        . Not affiliated with or sponsored by UT Arlington.
        <br />© {new Date().getFullYear()}{" "}
        <a href="https://acmuta.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
          ACM @ UT Arlington
        </a>
        . All rights reserved.
      </div>
    </div>
  );
};

export default FAQPage;
