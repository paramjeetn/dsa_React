import React, { useState } from 'react';
import QuestionBank from './components/QuestionBank';
import QuestionDetails from './components/QuestionDetails';

function App() {
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const handleQuestionSelect = (questionDetails, levelId, questionId) => {
    setSelectedQuestionDetails(questionDetails);
    setSelectedLevelId(levelId);
    setSelectedQuestionId(questionId);
  };

  const handleSave = (updatedQuestion) => {
    // Handle saving the updated question in the state if necessary
    const updatedQuestions = {
      ...selectedQuestionDetails,
      ...updatedQuestion,
    };

    setSelectedQuestionDetails(updatedQuestions);
  };

  return (
    <div className="App flex">
      <div className="w-1/2 p-4 border-r"> {/* Set to half width and add padding */}
        <QuestionBank onQuestionSelect={handleQuestionSelect} />
      </div>
      <div className="w-1/2 p-4"> {/* Set to half width and add padding */}
        {selectedQuestionDetails && (
          <QuestionDetails 
            questionDetails={selectedQuestionDetails}
            levelId={selectedLevelId}
            questionId={selectedQuestionId}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default App;
