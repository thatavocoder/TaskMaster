import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import { UserContext } from '../App';
import M from 'materialize-css';

export default function Register() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [buttonText, setButtonText] = React.useState('Register');
    const { state, dispatch } = useContext(UserContext)

    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePassChange = (event) => {
        setPassword(event.target.value);
    };

    const navigate = useNavigate();
    React.useEffect(() => {
        if (state) {
            navigate('/Dashboard')
        }
    }, [state])

    const handleClick = (event) => {
        event.preventDefault();

        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        setButtonText('Registering...');
        if (email === '' || password === '' || name === '') {
            alert('Please fill in all fields');
            setButtonText('Register');
        } else if (!emailPattern.test(email)) {
            alert('Please enter a valid email');
            setButtonText('Register');
        } else {
            fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        navigate('/login');
                    } else {
                        setButtonText('Register');
                        M.toast({ html: data.message, classes: 'red' });
                    }
                })
                .catch(err => {
                    setButtonText('Register');
                    M.toast({ html: 'Something went wrong', classes: 'red' });
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
                        <input placeholder="Name" id="name" type="text" class="validate" onChange={(e) => { handleNameChange(e) }} />
                    </div>
                    <div class="input-field col s12">
                        <input placeholder="Email" id="email" type="email" class="validate" onChange={(e) => { handleEmailChange(e) }} />
                    </div>
                    <div class="input-field col s12">
                        <input placeholder="Password" id="password" type="password" class="validate" onChange={(e) => { handlePassChange(e) }} />
                    </div>
                    <div class="col s12">
                        <button class="btn" variant="contained" color="secondary" style={{ margin: '1rem auto', width: "15rem", backgroundColor: "#e53935" }} type="button" onClick={(e) => { handleClick(e) }}>{buttonText}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
