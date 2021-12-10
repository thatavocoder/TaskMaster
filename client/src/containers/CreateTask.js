import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import M from 'materialize-css'

export default function CreateTask() {
    const [task, setTask] = React.useState(null)
    const [date, setDate] = React.useState(null)
    const [buttonText, setButtonText] = React.useState('Create')

    const handleTaskChange = (e) => {
        setTask(e.target.value)
    }
    const handleDateChange = (event) => {
        setDate(event.target.value)
    }

    const navigate = useNavigate()

    const handleClick = () => {
        setButtonText('Creating...')
        if (task === null || date === null) {
            setButtonText('Create')
            alert('Please fill in all fields')
            return
        }
        fetch('http://localhost:5000/api/createTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('tasktoken')
            },
            body: JSON.stringify({
                task: task,
                expected: date
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    navigate('/Dashboard')
                } else {
                    setButtonText('Create')
                    alert(data.message)
                    M.toast({ html: data.message, classes: 'red' })
                }
            })
            .catch(err => {
                setButtonText('Create')
                M.toast({ html: 'Something went wrong', classes: 'red' })
            })
    }
    return (
        <>
            <Navbar />
            <form style={{ textAlign: 'center', margin: '10% auto', width: '40%' }} class="row">
                <div class="input-field col s12">
                    <input placeholder="Task" id="task" type="text" class="validate" onChange={(e) => { handleTaskChange(e) }} />
                </div>
                <div class="input-field col s12">
                    <input placeholder="Excpected Date" id="date" type="date" class="validate" onChange={(e) => { handleDateChange(e) }} />
                </div>
                <div class="col s12">
                    <button class="btn modal-close" variant="contained" color="secondary" style={{ margin: '1rem auto', width: "15rem", backgroundColor: "#e53935" }} type="button" onClick={(e) => { handleClick(e) }}>{buttonText}</button>
                </div>
            </form>
        </>
    )
}
