import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, MinusCircle, GripVertical } from 'lucide-react';

const QuestionBank = ({ onQuestionSelect }) => {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/levels');
      setTree(response.data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const addQuestion = (levelIndex) => {
    console.log(`Adding question to level index: ${levelIndex}`);

    // Create a new question object locally
    const newQuestion = {
      _id: `temp-${Date.now()}`, // Temporary ID until the backend generates a real one
      text: `Question ${tree[levelIndex].questions.length + 1}`,
      details: { questionText: '', options: ['', '', ''], correctOption: '' }
    };

    // Update the frontend state immediately
    const updatedTree = [...tree];
    updatedTree[levelIndex].questions.push(newQuestion);
    setTree(updatedTree);

    // Now make the API call to save the new question
    const levelId = tree[levelIndex]._id;
    axios.post(`http://localhost:5000/api/levels/${levelId}/questions`, newQuestion)
      .then(response => {
        // Replace the temporary question with the one returned by the backend
        updatedTree[levelIndex].questions[updatedTree[levelIndex].questions.length - 1] = response.data;
        setTree([...updatedTree]);
      })
      .catch(error => {
        console.error('Error adding question:', error.response ? error.response.data : error.message);
        // Optionally remove the temp question if saving fails
      });
  };

  const removeQuestion = async (levelIndex, questionIndex) => {
    const updatedTree = [...tree];
    const levelId = updatedTree[levelIndex]._id;
    const questionId = updatedTree[levelIndex].questions[questionIndex]._id;

    try {
      await axios.delete(`http://localhost:5000/api/levels/${levelId}/questions/${questionId}`);
      
      updatedTree[levelIndex].questions.splice(questionIndex, 1);
      setTree(updatedTree);
    } catch (error) {
      console.error('Error deleting question:', error.response ? error.response.data : error.message);
    }
  };

  const addLevel = async () => {
    const newLevel = {
      level: tree.length + 1,
      questions: []
    };
    try {
      const response = await axios.post('http://localhost:5000/api/levels', newLevel);
      setTree([...tree, response.data]);
    } catch (error) {
      console.error('Error adding level:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Question Bank</h2>
      <div className="space-y-4">
        {tree.map((level, levelIndex) => (
          <div 
            key={levelIndex} 
            className="flex items-center space-x-4 p-2 border border-gray-200 rounded"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', levelIndex)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
              if (sourceIndex !== levelIndex) {
                const updatedTree = [...tree];
                const [removed] = updatedTree.splice(sourceIndex, 1);
                updatedTree.splice(levelIndex, 0, removed);
                setTree(updatedTree);
              }
            }}
          >
            <div className="cursor-move">
              <GripVertical className="h-6 w-6" />
            </div>
            <div className="w-32 text-right font-bold">Level {level.level}:</div>
            <div className="flex-1 flex items-center space-x-2">
              {level.questions.map((question, questionIndex) => (
                <div 
                  key={question._id} 
                  className="inline-block cursor-pointer hover:bg-gray-100 p-2 border border-gray-300 rounded"
                  onClick={() => onQuestionSelect(question.details, level._id, question._id)}
                >
                  <div className="p-2 flex items-center space-x-2">
                    <span>{question.text}</span>
                    <button 
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(levelIndex, questionIndex);
                      }}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="text-blue-500 border border-blue-500 px-2 py-1 rounded" onClick={() => addQuestion(levelIndex)}>
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-x-2">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={addLevel}>Add New Level</button>
      </div>
    </div>
  );
};

export default QuestionBank;
