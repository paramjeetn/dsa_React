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
      setTree(response.data);  // Set the fetched levels in the component state
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const addQuestion = async (levelIndex) => {
    const newQuestion = {
      text: `Question ${tree[levelIndex].questions.length + 1}`,
      details: { questionText: '', options: ['', '', ''], correctOption: '' }
    };

    const updatedTree = [...tree];
    updatedTree[levelIndex].questions.push(newQuestion);
    setTree(updatedTree);
    await saveLevel(updatedTree[levelIndex]);
  };

  const removeQuestion = async (levelIndex, questionIndex) => {
    const updatedTree = [...tree];
    const questionId = updatedTree[levelIndex].questions[questionIndex]._id;
    updatedTree[levelIndex].questions.splice(questionIndex, 1);
    setTree(updatedTree);
    await deleteQuestion(updatedTree[levelIndex]._id, questionId);
  };

  const addLevel = async () => {
    const newLevel = {
      level: tree.length + 1,
      questions: []
    };
    const response = await axios.post('http://localhost:5000/api/levels', newLevel);
    setTree([...tree, response.data]);
  };

  const saveLevel = async (level) => {
    try {
      await axios.put(`http://localhost:5000/api/levels/${level._id}`, level);
    } catch (error) {
      console.error('Error saving level:', error);
    }
  };

  const deleteQuestion = async (levelId, questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/levels/${levelId}/questions/${questionId}`);
    } catch (error) {
      console.error('Error deleting question:', error);
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
