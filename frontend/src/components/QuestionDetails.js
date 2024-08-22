import React, { useState, useEffect } from 'react';

const QuestionDetails = ({ questionDetails, onSave }) => {
  const [details, setDetails] = useState({
    questionText: questionDetails?.questionText || '',
    options: questionDetails?.options || ['', '', ''],
    correctOption: questionDetails?.correctOption || ''
  });

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

  const handleSave = () => {
    onSave(details);
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
          <input 
            key={index}
            type="text" 
            className="w-full border p-2 mb-2"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block mb-2">Correct Option:</label>
        <input 
          type="text" 
          className="w-full border p-2"
          value={details.correctOption}
          onChange={(e) => setDetails({ ...details, correctOption: e.target.value })}
        />
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Question
      </button>
    </div>
  );
};

export default QuestionDetails;
