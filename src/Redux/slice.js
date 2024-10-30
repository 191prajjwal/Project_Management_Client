import { createSlice } from '@reduxjs/toolkit';


const initialModalState = {
  isOpen: false, 
};

const initialModal2State = {
  isOpen: false, 
};



const initialBoardSwitch = {
  isBoardSwitch: false, 
};

const initialtoasty={
  toasty:false,
}

const initialLoader={
  loader:false,
}



export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialModalState,
  reducers: {
    closeModal: (state) => {
      state.isOpen = false; 
    },
    openModal: (state) => {
      state.isOpen = true; 
    },
  },
});

export const { closeModal: closeModal1, openModal: openModal1 } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;


export const modal2Slice = createSlice({
  name: 'modal2',
  initialState: initialModal2State,
  reducers: {
    closeModal: (state) => {
      state.isOpen = false; 
    },
    openModal: (state) => {
      state.isOpen = true; 
    },
  },
});

export const { closeModal: closeModal2, openModal: openModal2 } = modal2Slice.actions;

export const modal2Reducer = modal2Slice.reducer;


export const boardSwitch = createSlice({
  name: 'boardSwitch',
  initialState: initialBoardSwitch,
  reducers: {
    toggleBoardSwitch: (state) => {
      state.isBoardSwitch = !state.isBoardSwitch; 
    },
  },
});

export const { toggleBoardSwitch } = boardSwitch.actions;

export const boardSwitchReducer = boardSwitch.reducer;



export const toastyAction = createSlice({
  name: 'toastyAction',
  initialState: initialtoasty,
  reducers: {
    toggleToastyAction: (state) => {
      state.toasty = !state.toasty; 
    },
  },
});

export const { toggleToastyAction } = toastyAction.actions;

export const toastyActionhReducer = toastyAction.reducer;


export const loaderAction = createSlice({
  name: 'loaderAction',
  initialState: initialLoader,
  reducers: {
    toggleLoader: (state) => {
      state.loader = !state.loader; 
    },
  },
});

export const { toggleLoader } = loaderAction.actions;

export const loaderActionhReducer = loaderAction.reducer;


const initialItsTaskIdState = {
  taskId: null, 
};


export const itsTaskIdSlice = createSlice({
  name: 'itsTaskId',
  initialState: initialItsTaskIdState,
  reducers: {
    setTaskId: (state, action) => {
      state.taskId = action.payload; 
    },
    clearTaskId: (state) => {
      state.taskId = null; 
    },
  },
});

export const { setTaskId, clearTaskId } = itsTaskIdSlice.actions;

export const itsTaskIdReducer = itsTaskIdSlice.reducer;

