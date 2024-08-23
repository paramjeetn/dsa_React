import React, { useState } from 'react';
import QuestionBank from './components/QuestionBank';
import QuestionDetails from './components/QuestionDetails';
import './App.css';

function App() {
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState(null);

  const handleQuestionSelect = (questionDetails) => {
    setSelectedQuestionDetails(questionDetails);
  };

  const handleSaveQuestionDetails = (updatedDetails) => {
    // Here you would update the question in your database
    console.log('Saving question details:', updatedDetails);
    // You may want to update the state or perform additional actions here
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <QuestionBank onQuestionSelect={handleQuestionSelect} />
      </div>
      <div className="right-panel">
        {selectedQuestionDetails ? (
          <QuestionDetails
            questionDetails={selectedQuestionDetails}
            onSave={handleSaveQuestionDetails}
          />
        ) : (
          <div className="placeholder">Select a question to edit its details.</div>
        )}
      </div>
    </div>
  );
}

export default App;
