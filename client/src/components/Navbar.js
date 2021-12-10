import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App';

export default function Navbar() {
    const [isAuth, setIsAuth] = React.useState(null);
    const { state, dispatch } = React.useContext(UserContext)
    const navigate = useNavigate();

    const renderList = () => {
        if (state) {
            return [
                <li key="1"><Link to="/Dashboard">Dashboard</Link></li>,
                <li key="2"><Link to="/createTask">Create Task</Link></li>,
                <li key="3"><Link to="/Login">
                    <button className="btn" onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                    }} style={{ backgroundColor: "#e53935" }}>Logout</button>
                </Link></li>,
            ]
        } else {
            return [
                <li key="1"><Link to="/Login">Login</Link></li>,
                <li key="2"><Link to="/Register">Register</Link></li>
            ]
        }
    }

    return (
        <>
            <nav>
                <div className="nav-wrapper" style={{ backgroundColor: "#00acc1" }}>
                    <Link to={state ? "/Dashboard" : "/"} className="brand-logo left" style={{ fontFamily: "Grand Hotel, cursive" }}>Task Master</Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {renderList()}
                    </ul>
                </div>
            </nav>
        </>
    )
}
