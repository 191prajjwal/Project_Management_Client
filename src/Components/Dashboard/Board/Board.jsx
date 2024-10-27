import React, { useState, useEffect } from "react";
import StylesBoard from "./Board.module.css";
import Card from "../Card/Card";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import AddModalElement from "../AddModalElement/AddModalElement";
import { useSelector, useDispatch } from "react-redux";
import { closeModal1, openModal1 } from "../../../Redux/slice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AddModalElementEdit from "../AddModalElementEdit/AddModalElementEdit";

const Board = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("thisWeek");
  const [collasped, setCollasped] = useState({
    backlog: false,
    todo: false,
    inprogress: false,
    done: false,
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isOpenModal = useSelector((state) => state.modal.isOpen);

  const isBoardChanged = useSelector(
    (state) => state.boardSwitch.isBoardSwitch
  );

  const isTosty = useSelector((state) => state.toastyAction.toasty);

  const openEditModal = useSelector((state) => state.modal2.isOpen);

  const taskId = useSelector((state) => state.itsTaskId.taskId);

  const dispatch = useDispatch();

  const onOpenModal = () => dispatch(openModal1());
  const onCloseModal = () => dispatch(closeModal1());

  //modal end

  const fetchTasksToDo = async (userId, boardDate) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/tasks/filter`,
        { userId, boardDate },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("task data list", response.data.tasksToDo);
      return response.data.tasksToDo;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };

  const [tasksToDo, setTasksToDo] = useState([]);

  useEffect(
    () => {
      const userId = localStorage.getItem("id");
      const fetchData = async () => {
        try {
          const tasks = await fetchTasksToDo(userId, selectedOption);

          console.log(tasks)
          setTasksToDo(tasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };

      fetchData();
    },
    [selectedOption, isBoardChanged],
    []
  );

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const myName = localStorage.getItem("name");

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formatted = `${getFormattedDay(today)} ${getFormattedMonth(
      today
    )}, ${today.getFullYear()}`;
    setFormattedDate(formatted);
  }, []);

  function getFormattedDay(date) {
    const day = date.getDate();
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }

  function getFormattedMonth(date) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[date.getMonth()];
  }

  const [userData, setUserData] = useState([]);
  const [selectedAssign, setSelectedAssign] = useState({});

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}/api/v1/users/userdata`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(response);
      setUserData(response.data.userData);
    } catch (error) {
      console.error("Error fetching user Data:", error);
      toast.error("Failed to fetch email options.");
    }
  };


  const [isAddPeopleModalOpen, setIsAddPeopleModalOpen] = useState(false);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [assignTo, setAssignTo] = useState("");
  const onOpenAddPeopleModal = () => {
    setIsAddPeopleModalOpen(true);

    fetchUserData();
  };
  const onCloseAddPeopleModal = () => setIsAddPeopleModalOpen(false);

  const handleName = (name) => {
    const words = name.trim().split(" ");

    if (words.length === 1) {
      return (words[0].charAt(0) + (words[0].charAt(1) || "")).toUpperCase();
    } else if (words.length > 1) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }

    return "";
  };

  const handleEmailSelection = (id, email) => {
    setSelectedAssign({ id, email });
    setAssignTo(id)
    setDropdownOpen(false);
  };


  const handleClear = () => {
    setAssignTo("");                 
    setSelectedAssign({});          
    setDropdownOpen(false);         
};

  const handleAssign = async () => {
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseUrl}/api/v1/assign/tasks`,
        { userId, assignId:assignTo},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {

        if(selectedAssign.email)
        toast.success(`${selectedAssign.email} added to dashboard`)
      } else {
        console.error("Error:", response.data.message);
        toast.error(`Error assigning dashboard to user`)
        
      }
    } catch (error) {
      toast.error(`Atleast one task needed to assign the dashboard to a user`)
    }
  };


  return (
    <>
      {isTosty ? (
        toast.success("Url Copied!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      ) : (
        <></>
      )}

      <div>
        <br />
        <div className={StylesBoard.header}>
          <div className={StylesBoard.headerTitle}>
            Welcome! {myName[0].toUpperCase() + myName.slice(1)}
          </div>
          <div className={StylesBoard.headerDate}>{formattedDate}</div>
        </div>

        <div className={StylesBoard.header}>
          <div className={StylesBoard.headerTitle2}>
            Board{" "}
            <span
              className={StylesBoard.addPeople}
              onClick={onOpenAddPeopleModal}
            >
              {" "}
              <img src="Assets/people.png" alt="peopleImage" /> Add people
            </span>
          </div>
          <div className={StylesBoard.headerMenu}>
            <div className={StylesBoard.dropdown}>
              <select
                className={StylesBoard.dropdown}
                onChange={handleSelectChange}
                value={selectedOption}
              >
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
          </div>
        </div>
        <br />
        <div>
          <div
            className={`${StylesBoard.boardCards} ${StylesBoard.scroll}`}
            style={{ position: "relative", left: "261px" }}
          >
            <div className={StylesBoard.boardCards_background}>
              <br />
              <div
                className={StylesBoard.boardCards_backgroundTitle}
                style={{ position: "relative", left: "-111px" }}
              >
                Backlog
                <img
                  src="Assets/collaspe.svg"
                  alt="collaspe"
                  style={{
                    position: "relative",
                    right: "-231px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setCollasped({ ...collasped, backlog: !collasped.backlog })
                  }
                />
              </div>

              {tasksToDo.map((taskBoard, index) => {
                return (
                  taskBoard.board === "backlog" && (
                    <>
                      <br />{" "}
                      <Card
                        key={index}
                        priority={taskBoard.priority}
                        title={taskBoard.title}
                        checklist={taskBoard.checklist}
                        myTaskId={taskBoard._id}
                        serverFetchedDate={taskBoard.dueDate}
                        collasped={collasped.backlog}
                       
          
                      />
                    </>
                  )
                );
              })}
            </div>
            <div className={StylesBoard.boardCards_background}>
              <br />
              <div
                className={StylesBoard.boardCards_backgroundTitle}
                style={{ position: "relative", left: "-111px" }}
              >
                To do
                <img
                  src="Assets/add.svg"
                  alt="add"
                  style={{
                    position: "relative",
                    right: "-211px",
                    cursor: "pointer",
                  }}
                  onClick={onOpenModal}
                />
                <img
                  src="Assets/collaspe.svg"
                  alt="collaspe"
                  style={{
                    position: "relative",
                    right: "-231px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setCollasped({ ...collasped, todo: !collasped.todo });
                  }}
                />
              </div>

              {tasksToDo.map((taskBoard, index) => {
                return (
                  taskBoard.board === "toDo" && (
                    <>
                      <br />{" "}
                      <Card
                        key={index}
                        priority={taskBoard.priority}
                        title={taskBoard.title}
                        checklist={taskBoard.checklist}
                        myTaskId={taskBoard._id}
                        serverFetchedDate={taskBoard.dueDate}
                        collasped={collasped.todo}
                      />
                    </>
                  )
                );
              })}
            </div>
            <div className={StylesBoard.boardCards_background}>
              <br />
              <div
                className={StylesBoard.boardCards_backgroundTitle}
                style={{ position: "relative", left: "-100px" }}
              >
                In progress
                <img
                  src="Assets/collaspe.svg"
                  alt="collaspe"
                  style={{
                    position: "relative",
                    right: "-200px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setCollasped({
                      ...collasped,
                      inprogress: !collasped.inprogress,
                    })
                  }
                />
              </div>

              {tasksToDo.map((taskBoard, index) => {
                return (
                  taskBoard.board === "inProgress" && (
                    <>
                      <br />{" "}
                      <Card
                        key={index}
                        priority={taskBoard.priority}
                        title={taskBoard.title}
                        checklist={taskBoard.checklist}
                        myTaskId={taskBoard._id}
                        serverFetchedDate={taskBoard.dueDate}
                        collasped={collasped.inprogress}
                      />
                    </>
                  )
                );
              })}
            </div>
            <div className={StylesBoard.boardCards_background}>
              <br />
              <div
                className={StylesBoard.boardCards_backgroundTitle}
                style={{ position: "relative", left: "-111px" }}
              >
                Done
                <img
                  src="Assets/collaspe.svg"
                  alt="collaspe"
                  style={{
                    position: "relative",
                    right: "-231px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setCollasped({ ...collasped, done: !collasped.done })
                  }
                />
              </div>

              {tasksToDo.map((taskBoard, index) => {
                return (
                  taskBoard.board === "done" && (
                    <>
                      <br />{" "}
                      <Card
                        key={index}
                        priority={taskBoard.priority}
                        title={taskBoard.title}
                        checklist={taskBoard.checklist}
                        myTaskId={taskBoard._id}
                        serverFetchedDate={taskBoard.dueDate}
                        collasped={collasped.done}
                      />
                    </>
                  )
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isAddPeopleModalOpen}
        onClose={onCloseAddPeopleModal}
        center
        showCloseIcon={false}
        classNames={{
          modal: `${StylesBoard.addPeopleModal}`,
        }}
      >
        <div>
          <h3>Add people to the board</h3>
          <div
            className={StylesBoard.dropdownContainer}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className={StylesBoard.dropdownLabel}>
              {selectedAssign.email
                ? selectedAssign.email
                : "Select users to assign task"}
            </span>
            <span className={StylesBoard.dropdownIcon}>
              {dropdownOpen ? "▲" : "▼"}
            </span>
          </div>

          {dropdownOpen && (



            <ul className={StylesBoard.emailList}>

{selectedAssign.email&&<div className={StylesBoard.clear}><button onClick={handleClear}>Clear dashboard assignment</button></div>}
              {userData.length > 0 ? (
                userData.map((user, index) => (
                  <li
                    key={index}
                    onClick={() => handleEmailSelection(user.id, user.email)}
                    className={`${StylesBoard.emailListItems} ${
                      selectedAssign === user.email
                        ? StylesBoard.selectedAssignItem
                        : ""
                    }`}
                  >
                    <label>
                      <input
                        type="radio"
                        name="email"
                        value={user.email}
                        checked={selectedAssign === user.email}
                        onChange={() => setSelectedAssign(user.email)}
                        style={{ display: "none" }}
                      />
                      <span className={StylesBoard.nameIcon}>
                        {handleName(user.name)}
                      </span>
                      <span className={StylesBoard.emailSpan}>
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

          <div className={StylesBoard.buttonGroup}>
            <button
              onClick={() => {
                if (!selectedAssign) {
                  toast.error("Select a user to assign a task");
                  return;
                }
                handleAssign();
                onCloseAddPeopleModal();
              }}
              className={StylesBoard.assignBtn}
            >
              Assign 
            </button>
            <button
              onClick={onCloseAddPeopleModal}
              className={StylesBoard.closeBtn}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isOpenModal}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
        classNames={{
          modal: `${StylesBoard.customModal}`,
        }}
      >
        {<AddModalElement />}
      </Modal>
      {/* modal end+++++++++++++++++++++++++++++++++++ */}

      {/* ?modal start++++++++++++++++++++++++++++++++ */}

      <Modal
        open={openEditModal}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
        classNames={{
          modal: `${StylesBoard.customModal}`,
        }}
      >
        {<AddModalElementEdit taskId={taskId} />}
      </Modal>
      {/* modal end+++++++++++++++++++++++++++++++++++ */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Board;
