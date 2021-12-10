import './App.css';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './containers/Home';
import { userReducer, initialState } from './reducers/userReducer'
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import Register from './containers/Register';
import CreateTask from './containers/CreateTask';
import EditTask from './containers/EditTask';

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('taskdata'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
    } else {
      navigate('/', { replace: true })
    }
  }, [])
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/createTask" element={<CreateTask />} />
        <Route path="/editTask/:taskId" element={<EditTask />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  )
}


function App() {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <>
      <Router>
          <UserContext.Provider value={{ state, dispatch }}>
            <Routing />
          </UserContext.Provider>
      </Router>
    </>
  );
}

export default App;
