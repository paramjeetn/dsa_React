import React, { useState } from 'react';
import QuestionBank from './components/QuestionBank';
import QuestionDetails from './components/QuestionDetails';
import './App.css';

function App() {
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const handleQuestionSelect = (questionDetails, levelId, questionId) => {
    setSelectedQuestionDetails(questionDetails);
    setSelectedLevelId(levelId);
    setSelectedQuestionId(questionId);
  };

  const handleSaveQuestionDetails = (updatedDetails) => {
    // Here you can update the state or UI based on the saved question
    console.log('Question details saved:', updatedDetails);
  };

  return (
    <div className="app-container flex">
      <div className="left-panel w-1/2 border-r">
        <QuestionBank onQuestionSelect={handleQuestionSelect} />
      </div>
      <div className="right-panel w-1/2">
        {selectedQuestionDetails ? (
          <QuestionDetails
            questionDetails={selectedQuestionDetails}
            levelId={selectedLevelId}
            questionId={selectedQuestionId}
            onSave={handleSaveQuestionDetails}
          />
        ) : (
          <div className="placeholder p-4">Select a question to edit its details.</div>
        )}
      </div>
    </div>
  );
}

export default App;
