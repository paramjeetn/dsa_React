import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Base URL for switching between local and cloud DBOS backend
const BASE_URL = 'https://paramjeetnpradhan-dbos_demo.cloud.dbos.dev';  // Change to 'http://localhost:5000' for local testing

const QuestionDetails = ({ questionDetails, levelId, questionId, onSave }) => {
  const [details, setDetails] = useState({
    questionTitle: questionDetails?.title || '',
    questionText: questionDetails?.questionText || '',
    options: questionDetails?.options || ['', '', ''],
    correctOption: questionDetails?.correctOption || ''
  });

  const [currentQuestionId, setCurrentQuestionId] = useState(questionId || null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    setDetails({
      questionTitle: questionDetails?.title || '',
      questionText: questionDetails?.questionText || '',
      options: questionDetails?.options || ['', '', ''],
      correctOption: questionDetails?.correctOption || ''
    });
    setCurrentQuestionId(questionId || null);
  }, [questionDetails, questionId]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...details.options];
    newOptions[index] = value;
    setDetails({ ...details, options: newOptions });
  };

  const handleCorrectOptionChange = (index) => {
    setDetails({
      ...details,
      correctOption: details.options[index],
    });
  };

  const validateDetails = () => {
    if (!details.questionTitle.trim()) {
      return "Question title cannot be empty.";
    }
    if (!details.questionText.trim()) {
      return "Question text cannot be empty.";
    }
    if (details.options.some(option => !option.trim())) {
      return "All options must be filled out.";
    }
    if (!details.correctOption.trim()) {
      return "You must select a correct option.";
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateDetails();
    if (validationError) {
      setNotification(validationError);
      return;
    }

    try {
      let savedQuestion;

      if (currentQuestionId && !currentQuestionId.startsWith('temp-')) {
        // Update existing question
        await axios.put(`${BASE_URL}/levels/${levelId}/questions/${currentQuestionId}`, {
          title: details.questionTitle,
          text: details.questionText,
          details: details,
        });
      } else {
        // Create new question
        const response = await axios.post(`${BASE_URL}/levels/${levelId}/questions`, {
          title: details.questionTitle,
          text: details.questionText,
          details: details,
        });
        savedQuestion = response.data;
        setCurrentQuestionId(savedQuestion._id);
        onSave(savedQuestion);
      }

      setNotification('Question saved successfully!');
      setTimeout(() => setNotification(''), 3000);

    } catch (error) {
      console.error('Error saving question details:', error);
      setNotification('Failed to save question.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h3 className="text-xl font-bold mb-4">Edit Question Details</h3>
      <div className="mb-4">
        <label className="block mb-2">Question Title:</label>
        <input 
          type="text" 
          className="w-full border p-2"
          value={details.questionTitle}
          onChange={(e) => setDetails({ ...details, questionTitle: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Question Text:</label>
        <input 
          type="text" 
          className="w-full border p-2"
          value={details.questionText}
          onChange={(e) => setDetails({ ...details, questionText: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Option 1:</label>
        <div className="flex items-center mb-2">
          <input 
            type="text" 
            className="w-full border p-2 mr-2"
            value={details.options[0]}
            onChange={(e) => handleOptionChange(0, e.target.value)}
          />
          <button
            className={`p-2 rounded ${details.correctOption === details.options[0] ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            onClick={() => handleCorrectOptionChange(0)}
          >
            {details.correctOption === details.options[0] ? 'Correct' : 'Set as Correct'}
          </button>
        </div>
        <label className="block mb-2">Option 2:</label>
        <div className="flex items-center mb-2">
          <input 
            type="text" 
            className="w-full border p-2 mr-2"
            value={details.options[1]}
            onChange={(e) => handleOptionChange(1, e.target.value)}
          />
          <button
            className={`p-2 rounded ${details.correctOption === details.options[1] ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            onClick={() => handleCorrectOptionChange(1)}
          >
            {details.correctOption === details.options[1] ? 'Correct' : 'Set as Correct'}
          </button>
        </div>
        <label className="block mb-2">Option 3:</label>
        <div className="flex items-center mb-2">
          <input 
            type="text" 
            className="w-full border p-2 mr-2"
            value={details.options[2]}
            onChange={(e) => handleOptionChange(2, e.target.value)}
          />
          <button
            className={`p-2 rounded ${details.correctOption === details.options[2] ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            onClick={() => handleCorrectOptionChange(2)}
          >
            {details.correctOption === details.options[2] ? 'Correct' : 'Set as Correct'}
          </button>
        </div>
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Question
      </button>

      {notification && (
        <div className={`mt-4 p-2 rounded ${notification.includes('Failed') || notification.includes('cannot') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default QuestionDetails;
