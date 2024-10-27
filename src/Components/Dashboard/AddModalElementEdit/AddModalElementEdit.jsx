import React, { useState, forwardRef, useEffect } from "react";
import StylesAddModalElementEdit from "./AddModalElementEdit.module.css";
import ModalTaskListEdit from "../ModalTaskListEdit/ModalTaskListEdit";
import { useDispatch } from "react-redux";
import { closeModal2, toggleLoader } from "../../../Redux/slice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddModalElementEdit = ({ taskId }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [selectedPriority, setSelectedPriority] = useState(null);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const uId = localStorage.getItem("id");
  const myBoard = "toDo";
  const [checklists, setChecklists] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [assignTo,setAssignTo]=useState("")

  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchTaskData = () => {
    axios
      .get(`${baseUrl}/api/v1/tasks/editview/${taskId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const task = response.data.tasks[0];
        setSelectedPriority(task.priority);
        setStartDate(task.dueDate ? task.dueDate : null);
        setChecklists(task.checklist);
        setTaskTitle(task.title);
        setAssignTo(task.assignTo)
       
      })
      .catch((error) => {
        console.error("Error fetching task data:", error);
        toast.error("Error fetching task data");
      });
  };

  const handleCloseModal = () => {
    dispatch(toggleLoader());
    dispatch(closeModal2());
  };

  const handlePriorityClick = (priority) => {
    setSelectedPriority(priority);
  };

  const handleTaskCheck = (id, completed) => {
    const updatedChecklists = checklists.map((checklist) => {
      if (checklist._id === id) {
        return { ...checklist, completed: completed };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
  };

  const handleTaskDelete = (id) => {
    const filteredChecklists = checklists.filter(
      (checklist) => checklist._id !== id
    );
    setChecklists(filteredChecklists);
  };

  const handleSave = () => {
    const priority = selectedPriority;
    const dueDate = startDate instanceof Date
      ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString()
      : startDate; 
    
    const board = myBoard;
  
    const nonEmptyChecklist = checklists.filter(
      (item) => item.taskName.trim() !== ""
    );
  
    if (!taskTitle.trim()) {
      toast.error("Title can't be empty.");
      return;
    }
    if (!priority) {
      toast.error("Please choose a priority.");
      return;
    }
    if (nonEmptyChecklist.length === 0) {
      toast.error("Please choose at least one checklist item.");
      return;
    }
  
    const checklist = nonEmptyChecklist.map((item) => ({
      taskName: item.taskName,
      completed: item.completed,
    }));
  
    const data = {
      title: taskTitle,
      priority,
      checklist,
      dueDate,
      board,
      assignTo
    };

   
  
    axios
      .put(`${baseUrl}/api/v1/tasks/update/${taskId}`, data, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        handleCloseModal();


       setTimeout(()=>{
        window.location.reload();
       },1000)
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        toast.error(error);
      });
  };
  

  const DateInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className={StylesAddModalElementEdit.button1}
      onClick={onClick}
      ref={ref}
    >
      {value || "Select Due Date"}
    </button>
  ));

  let checkMarkMe = 0;


  const [selectedAssign, setSelectedAssign] = useState({});

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [userData,setUserData]=useState([])
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}/api/v1/users/userdata`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      
      setUserData(response.data.userData);
    } catch (error) {
      console.error("Error fetching user Data:", error);
      toast.error("Failed to fetch email options.");
    }
  };

  const handleEmailSelection = (id, email) => {
    setSelectedAssign({ id, email });
    setAssignTo(id); 
    setDropdownOpen(false); 
  };

  const handleName = (name) => {
    const words = name.trim().split(" ");

    if (words.length === 1) {
      return (words[0].charAt(0) + (words[0].charAt(1) || "")).toUpperCase();
    } else if (words.length > 1) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }

    return "";
  };


  useEffect(()=>{
    fetchUserData()
  },[])


 

  return (
    <>
      <div className={StylesAddModalElementEdit.AddModalElementEdit}>
        <div className={StylesAddModalElementEdit.title}>
          Title<span className={StylesAddModalElementEdit.asterisk}> *</span>
        </div>
        <div>
          <input
            id="taskTitle"
            type="text"
            className={StylesAddModalElementEdit.inputTitle}
            placeholder="Enter Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <span>
            Select Priority
            <span className={StylesAddModalElementEdit.asterisk}>*</span>
          </span>
          <div className={StylesAddModalElementEdit.priorityOptions}>
            <button
              value="HIGH PRIORITY"
              className={
                selectedPriority === "HIGH PRIORITY"
                  ? StylesAddModalElementEdit.addPriorityColor
                  : StylesAddModalElementEdit.addPriority
              }
              onClick={() => handlePriorityClick("HIGH PRIORITY")}
            >
              <img src="Assets/high.svg" alt="addPriority" />
              &nbsp;&nbsp;HIGH PRIORITY
            </button>
            <button
              value="MODERATE PRIORITY"
              className={
                selectedPriority === "MODERATE PRIORITY"
                  ? StylesAddModalElementEdit.addPriorityColor
                  : StylesAddModalElementEdit.addPriority
              }
              onClick={() => handlePriorityClick("MODERATE PRIORITY")}
            >
              <img src="Assets/moderate.svg" alt="addPriority" />
              &nbsp;&nbsp;MODERATE PRIORITY
            </button>
            <button
              value="LOW PRIORITY"
              className={
                selectedPriority === "LOW PRIORITY"
                  ? StylesAddModalElementEdit.addPriorityColor
                  : StylesAddModalElementEdit.addPriority
              }
              onClick={() => handlePriorityClick("LOW PRIORITY")}
            >
              <img src="Assets/low.svg" alt="addPriority" />
              &nbsp;&nbsp;LOW PRIORITY
            </button>
          </div>
        </div>

<br />
 <div > <span className={StylesAddModalElementEdit.assignTo}>Assign to</span>

          <span className={StylesAddModalElementEdit.dropdownContainer} onClick={() => setDropdownOpen(!dropdownOpen)}>
  <span className={StylesAddModalElementEdit.dropdownLabel}>
    {selectedAssign.email? selectedAssign.email : "Select users to assign task"}
  </span>
  <span className={StylesAddModalElementEdit.dropdownIcon}>
    {dropdownOpen ? "▲" : "▼"}
  </span>
</span>

{dropdownOpen && (
  <ul className={StylesAddModalElementEdit.emailList}>


    {userData.length > 0 ? (
      userData.map((user, index) => (
        <li
          key={index}
          onClick={() => handleEmailSelection(user.id, user.email)}
          className={`${StylesAddModalElementEdit.emailListItems} ${
            selectedAssign?.email === user.email
              ? StylesAddModalElementEdit.selectedAssignItem
              : ""
          }`}
        >
          <label>
            <input
              type="radio"
              name="email"
              value={user.email}
              checked={selectedAssign?.email === user.email}
              onChange={() => handleEmailSelection(user.id, user.email)}
              style={{ display: "none" }}
            />
            <span className={StylesAddModalElementEdit.nameIcon}>
              {handleName(user.name)}
            </span>
            <span className={StylesAddModalElementEdit.emailSpan}>
              {user.email}
            </span>
          </label>
        </li>
      ))
    ) : (
      <p>No users available</p>
    )}
     
  </ul>

 
)}

          </div>




        <div>
          <br />
          <span>
            Checklist (
            {checklists.map((checklist) => {
              if (checklist.completed === true) {
                checkMarkMe = checkMarkMe + 1;
              }
            })}
            {checkMarkMe}/{checklists.length})
            <span className={StylesAddModalElementEdit.asterisk}>*</span>
          </span>
        
        </div>
        <div className={StylesAddModalElementEdit.checklist}>
          <ModalTaskListEdit
            checklists={checklists}
            setChecklists={setChecklists}
            onTaskCheck={handleTaskCheck}
            onTaskDelete={handleTaskDelete}
          />
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <div className={StylesAddModalElementEdit.dateDiv}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<DateInput />}
                placeholderText="Select Due Date"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "21px" }}>
            <button
              className={StylesAddModalElementEdit.cancel}
              onClick={() => handleCloseModal()}
            >
              Cancel
            </button>
            <button
              className={StylesAddModalElementEdit.save}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddModalElementEdit;
