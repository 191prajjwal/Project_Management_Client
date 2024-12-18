import React, { useState } from 'react';
import StylesTaskList from './TaskList.module.css';
import axios from 'axios';

const TaskList = ({ taskName, completed, taskListId, checkListId , myChecklistDisplay}) => {

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [inputValue, setInputValue] = useState(taskName);
  const [isChecked, setIsChecked] = useState(completed);


  const handleCheckboxChange = async (e) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);

    try {
      const response = await axios.post(`${baseUrl}/api/v1/tasks/update/checklist`, {
        taskId: taskListId,
        checklistItemId: checkListId,
        completed: newChecked,
      },
      {
          headers: {
              'Authorization': `${localStorage.getItem('token')}`
          }
      });

  
      myChecklistDisplay(newChecked);
    } catch (error) {
      console.error('Error updating checklist item:', error);
      if (error.response) {
        console.error('Server Response Data:', error.response.data);
        console.error('Status Code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };




  return (
    <div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className={StylesTaskList.checkbox}
      />

      <input
        type="text"
        value={inputValue}
        className={StylesTaskList.inputTask}
      />
    </div>
  );
};

export default TaskList;
