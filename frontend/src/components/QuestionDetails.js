import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionDetails = ({ questionDetails, levelId, questionId, onSave }) => {
  const [details, setDetails] = useState({
    questionText: questionDetails?.questionText || '',
    options: questionDetails?.options || ['', '', ''],
    correctOption: questionDetails?.correctOption || ''
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    setDetails({
      questionText: questionDetails?.questionText || '',
      options: questionDetails?.options || ['', '', ''],
      correctOption: questionDetails?.correctOption || ''
    });
  }, [questionDetails]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...details.options];
    newOptions[index] = value;
    setDetails({ ...details, options: newOptions });
  };

  const handleCorrectOptionChange = (index) => {
    setDetails({ 
      ...details, 
      correctOption: details.options[index] // Set the correct option to the one selected
    });
  };

  const handleSave = async () => {
    try {
      if (questionId) {
        // Update existing question
        await axios.put(`http://localhost:5000/api/levels/${levelId}/questions/${questionId}`, {
          text: details.questionText,
          details: details
        });
      } else {
        // Create new question
        await axios.post(`http://localhost:5000/api/levels/${levelId}/questions`, {
          text: details.questionText,
          details: details
        });
      }
      
      onSave(details); // Call the onSave function passed as a prop to update the frontend state
      
      // Show success notification
      setNotification('Question saved successfully!');
      setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds

    } catch (error) {
      console.error('Error saving question details:', error);
      // Show error notification
      setNotification('Failed to save question.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h3 className="text-xl font-bold mb-4">Edit Question Details</h3>
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
        <label className="block mb-2">Options:</label>
        {details.options.map((option, index) => (
          <div key={index} className="mb-2 flex items-center">
            <input 
              type="text" 
              className="w-full border p-2 mr-2"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            <button
              className={`p-2 rounded ${details.correctOption === option ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
              onClick={() => handleCorrectOptionChange(index)}
            >
              {details.correctOption === option ? 'Correct' : 'Set as Correct'}
            </button>
          </div>
        ))}
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Question
      </button>

      {notification && (
        <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
          {notification}
        </div>
      )}
    </div>
  );
};

export default QuestionDetails;
