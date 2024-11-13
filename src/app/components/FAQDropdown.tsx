import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

interface FAQDropdownProps {
  question: string;
  answer: string;
}

const FAQDropdown: React.FC<FAQDropdownProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Sanitize the answer content
  const sanitizedAnswer = DOMPurify.sanitize(answer);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={toggleDropdown}
        className={`flex justify-between items-center w-full px-6 py-4 text-left text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 ${
          isOpen ? "rounded-t-lg" : "rounded-lg"
        }`}
      >
        <span className="text-lg font-medium">{question}</span>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-900 text-gray-400">
          <div dangerouslySetInnerHTML={{ __html: sanitizedAnswer }} />
        </div>
      )}
    </div>
  );
};

export default FAQDropdown;
