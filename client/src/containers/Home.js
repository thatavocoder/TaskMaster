import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { UserContext } from '../App';

export default function Home() {
    const navigate = useNavigate();
    const { state, dispatch } = React.useContext(UserContext)
    React.useEffect(() => {
        if (state) {
            navigate('/dashboard')
        } else {
            navigate('/')
        }
    }, [state])
    return (
        <>
            <Navbar />
            <div style={{ width: "40%", backgroundColor: "#00acc1", margin: "2rem auto", padding: "3rem 2rem" }}>
                <p style={{ textAlign: 'center', margin: '1rem 0', fontSize: '2.5rem' }}>Task Master</p>
                <form style={{ textAlign: 'center', marginTop: '10%' }} class="row">
                    <div class="col s12">
                        <button class="btn" variant="contained" color="secondary" style={{ margin: '1rem auto', width: "15rem", backgroundColor:"#e53935" }} onClick={() => navigate('/login')}>Login</button>
                    </div>
                    <div class="col s12">
                        <button class="btn" variant="contained" color="secondary" style={{ margin: '1rem auto', width: "15rem", backgroundColor:"#e53935" }} onClick={() => navigate('/register')}>Register</button>
                    </div>
                </form>
            </div>
        </>
    )
}
