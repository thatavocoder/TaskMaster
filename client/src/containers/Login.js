import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import { UserContext } from '../App';
import M from 'materialize-css';

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [buttonText, setButtonText] = React.useState('Login');
    const { state, dispatch } = useContext(UserContext)


    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePassChange = (event) => {
        setPassword(event.target.value);
    };

    const navigate = useNavigate();
    React.useEffect(() => {
        if (state) {
            navigate('/dashboard')
        }
    }, [state])

    const handleClick = (event) => {
        event.preventDefault();

        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        setButtonText('Logging in...');
        if (email === '' || password === '') {
            alert('Please fill in all fields');
            setButtonText('Login');
        } else if (!emailPattern.test(email)) {
            alert('Please enter a valid email');
            setButtonText('Login');
        } else {
            fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        localStorage.setItem('tasktoken', data.token);
                        localStorage.setItem('taskdata', JSON.stringify(data))
                        dispatch({ type: 'USER', payload: data });
                        navigate('/dashboard');
                    } else {
                        M.toast({ html: data.message, classes: 'red' });
                        setButtonText('Login');
                    }
                })
                .catch(err => {
                    M.toast({ html: 'Something went wrong', classes: 'red' });
                    setButtonText('Login');
                });
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ width: "40%", backgroundColor: "#00acc1", margin: "2rem auto", padding: "3rem 2rem" }}>
                <p style={{ textAlign: 'center', margin: '1rem 0', fontSize: '2.5rem' }}>Task Master</p>
                <form style={{ textAlign: 'center', marginTop: '10%' }} class="row">
                    <div class="input-field col s12">
                        <input placeholder="Email" id="email" type="email" class="validate" onChange={(e)=>{handleEmailChange(e)}} />
                    </div>
                    <div class="input-field col s12">
                        <input placeholder="Password" id="password" type="password" class="validate" onChange={(e)=>{handlePassChange(e)}} />
                    </div>
                    <div class="col s12">
                        <button class="btn" variant="contained" color="secondary" style={{ margin: '1rem auto', width: "15rem", backgroundColor: "#e53935" }} type="button" onClick={(e) => {handleClick(e)}}>{buttonText}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
