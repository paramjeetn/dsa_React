import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionDetails = ({ questionDetails, levelId, questionId, onSave }) => {
  const [details, setDetails] = useState({
    questionText: questionDetails?.questionText || '',
    options: questionDetails?.options || ['', '', ''],
    correctOption: questionDetails?.correctOption || ''
  });

  const [currentQuestionId, setCurrentQuestionId] = useState(questionId || null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    setDetails({
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
      correctOption: details.options[index]
    });
  };

  const validateDetails = () => {
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
        console.log('in update existing question');
        console.log(levelId);
        console.log(currentQuestionId);
        await axios.put(`http://localhost:5000/api/levels/${levelId}/questions/${currentQuestionId}`, {
          text: details.questionText,
          details: details
        });
      } else {
        // Create new question
        console.log('in create new question');
        console.log(levelId);
        const response = await axios.post(`http://localhost:5000/api/levels/${levelId}/questions`, {
          text: details.questionText,
          details: details
        });
        savedQuestion = response.data;
        setCurrentQuestionId(savedQuestion._id);  // Update with the real ID from the backend
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
        <div className={`mt-4 p-2 rounded ${notification.includes('Failed') || notification.includes('cannot') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default QuestionDetails;
