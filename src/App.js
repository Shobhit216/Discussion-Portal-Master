import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import React, { useState, useEffect } from "react";

//import {routes} from "./routes";


function App() {
   // State for questions, subject, question, search term, response details, and displayed question
  const [questions, setQuestions] = useState([]);
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [responseName, setResponseName] = useState("");
  const [responseComment, setResponseComment] = useState("");
  const [showQuestion, setShowQuestion] = useState(null);

  // Load questions from localStorage on initial render
  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    setQuestions(storedQuestions);
  }, []);

  // Save questions to localStorage whenever questions state changes
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  // Event handler for subject input change
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  // Event handler for question input change
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  // Event handler for submitting a new question
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (subject.trim() === "" || question.trim() === "") {
      // Validation: Subject and Question are mandatory
      return;
    }

    // Create a new question object
    const newQuestion = {
      id: Date.now(),
      subject,
      question,
      responses: [],
      upvotes: 0,
      timestamp: new Date(),
      favorite: false,
    };

    // Update questions state with the new question
    setQuestions([...questions, newQuestion]);
    // Clear subject and question inputs
    setSubject("");
    setQuestion("");
  };

  // Event handler for submitting a response to a question
  const handleResponse = (e, questionId) => {
    e.preventDefault();
    if (responseName.trim() === "" || responseComment.trim() === "") {
      // Validation: Name and Comment are mandatory
      return;
    }

    // Update questions state with the new response
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            responses: [
              ...q.responses,
              {
                name: responseName,
                comment: responseComment,
                upvotes: 0,
                timestamp: new Date(),
                favorite: false,
              },
            ],
          }
        : q
    );

    setQuestions(updatedQuestions);
    // Clear response inputs
    setResponseName("");
    setResponseComment("");
  };

  // Event handler for search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to calculate time difference for timestamp
  const calculateTimeDifference = (timestamp) => {
    const now = new Date();
    const timeDiff = now - new Date(timestamp);

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  };

  // Event handler for upvoting a question
  const handleUpvote = (questionId) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
    );

    setQuestions(updatedQuestions);
  };

  // Event handler for downvoting a question
  const handleDownvote = (questionId) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, upvotes: q.upvotes - 1 } : q
    );

    setQuestions(updatedQuestions);
  };

  // Filter questions based on search term
  const filteredQuestions = questions.filter(
    (q) =>
      q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Event handler for resolving a question
  const handleResolve = (questionId) => {
    const updatedQuestions = questions.filter((q) => q.id !== questionId);
    setQuestions(updatedQuestions);
    setShowQuestion(null); // Display the new question form in the right pane
  };

  // Event handler for marking a question as favorite
  const handleFavoriteQuestion = (questionId) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, favorite: !q.favorite } : q
    );

    setQuestions(updatedQuestions);
  };

  // Event handler for marking a response as favorite
  const handleFavoriteResponse = (questionId, responseIndex) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            responses: q.responses.map((r, index) =>
              index === responseIndex ? { ...r, favorite: !r.favorite } : r
            ),
          }
        : q
    );

    setQuestions(updatedQuestions);
  };

  // Function to highlight the search term in a text
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm) {
      return text;
    }

    // Convert text and search term to lowercase for case-insensitive search
    const lowerCaseText = text.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    let startIndex = 0;
    let result = [];

    // Iterate through the text
    while (startIndex < text.length) {
      // Find the index of the search term (case-insensitive)
      const indexOfTerm = lowerCaseText.indexOf(
        lowerCaseSearchTerm,
        startIndex
      );

      // If the search term is not found, add the remaining text and break the loop
      if (indexOfTerm === -1) {
        result.push(text.substring(startIndex));
        break;
      }

      // Add the text before the search term
      result.push(text.substring(startIndex, indexOfTerm));

      // Wrap the search term in a <span> with a background color
      result.push(
        <span key={startIndex} className="bg-yellow-200">
          {text.substring(indexOfTerm, indexOfTerm + searchTerm.length)}
        </span>
      );

      // Update the start index to continue the search after the current term
      startIndex = indexOfTerm + searchTerm.length;
    }

    // Return an array of text parts and <span> elements (JSX)
    return result;
  };

  return (
    <>
      <div className="pt-4 pb-7 px-8 bg-emerald-600 text-white">
        <h2 className="text-3xl font-bold">Discussion Portal</h2>
      </div>
      <div className="flex">
        {/* Left Pane */}
        <div className="w-1/2">
          <div className="flex justify-between px-4 pt-3 mb-4">
            <div className="flex items-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowQuestion(null)}
              >
                New Question
              </button>
              <input
                type="text"
                placeholder="Search Question"
                value={searchTerm}
                onChange={handleSearchChange}
                className="ml-2 p-2 border rounded"
              />
            </div>
          </div>
          {/* List of Questions */}
          {(searchTerm !== "" ? filteredQuestions : questions)
            .sort((a, b) => {
              // First, sort by favorites in descending order
              if (b.favorite !== a.favorite) {
                return b.favorite ? 1 : -1;
              }

              // If favorites are equal, then sort by upvotes in descending order
              return b.upvotes - a.upvotes;
            })
            .map((q) => (
              <div
                key={q.id}
                className={`mb-2 px-4 hover:bg-slate-300 border-t border-b border-x-0 border cursor-pointer ${
                  showQuestion === q.id ? "bg-gray-300" : ""
                }`}
                onClick={() => setShowQuestion(q.id)}
              >
                <h4>
                  {q.favorite && "⭐ "} 
                  {highlightSearchTerm(q.subject, searchTerm)} (Upvotes:{" "}
                  {q.upvotes}) - {calculateTimeDifference(q.timestamp)}
                </h4>
                <p>{highlightSearchTerm(q.question, searchTerm)}</p>
                <div className="flex mt-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleUpvote(q.id)}
                  >
                    Upvote
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDownvote(q.id)}
                  >
                    Downvote
                  </button>
                  <button
                    className={`ml-auto ${
                      q.favorite ? "text-yellow-500" : "text-gray-500"
                    }`}
                    onClick={() => handleFavoriteQuestion(q.id)}
                  >
                    Favorite
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Right Pane */}
        <div className="w-1/2 px-10 py-6 bg-gray-50 h-full">
          {showQuestion !== null ? (
            <>
              <div className="">
                <h3 className="text-xl">Question</h3>
                <div className="mb-2 px-4 py-2">
                  <h4>
                    {questions.find((q) => q.id === showQuestion)?.favorite &&
                      "⭐ "} 
                    {questions.find((q) => q.id === showQuestion)?.subject}{" "}
                    (Upvotes:{" "}
                    {questions.find((q) => q.id === showQuestion)?.upvotes})
                  </h4>
                  <p>
                    {questions.find((q) => q.id === showQuestion)?.question} -{" "}
                    {calculateTimeDifference(
                      questions.find((q) => q.id === showQuestion)?.timestamp
                    )}
                  </p>
                </div>
                <div className="flex justify-end w-full">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleResolve(showQuestion)}
                  >
                    Resolve
                  </button>
                </div>

                <h3 className="my-5 text-lg font-semibold">Responses</h3>

                <div>
                  {questions
                    .find((q) => q.id === showQuestion)
                    ?.responses.sort(
                      (a, b) => (b.favorite ? -1 : 1) * (b.upvotes - a.upvotes)
                    )
                    .map((response, index) => (
                      <div key={index} className="border p-2 mt-2">
                        <p>
                          {response.favorite && "⭐ "} 
                          {response.name} (Upvotes: {response.upvotes}) -{" "}
                          {calculateTimeDifference(response.timestamp)}
                        </p>{" "}
                        {response.comment}
                        <button
                          className={`ml-auto ${
                            response.favorite
                              ? "text-yellow-500"
                              : "text-gray-500"
                          }`}
                          onClick={() =>
                            handleFavoriteResponse(showQuestion, index)
                          }
                        >
                          Favorite
                        </button>
                      </div>
                    ))}
                </div>

                <h5 className="my-1 text-base font-semibold">Add Response</h5>
                {/* Response Form */}
                <form onSubmit={(e) => handleResponse(e, showQuestion)}>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Name:
                    </label>
                    <input
                      type="text"
                      value={responseName}
                      onChange={(e) => setResponseName(e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Comment:
                    </label>
                    <textarea
                      value={responseComment}
                      onChange={(e) => setResponseComment(e.target.value)}
                      className="p-2 border rounded"
                      rows="2"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit Response
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Welcome to Discussion Portal
                </h2>
                <p>Enter a subject and question to get started</p>
                {/* Question Form */}
                <form onSubmit={handleQuestionSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Subject:
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={handleSubjectChange}
                      className="p-2 w-full border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Question:
                    </label>
                    <textarea
                      value={question}
                      onChange={handleQuestionChange}
                      className="p-2 w-full border rounded"
                      rows="4"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
