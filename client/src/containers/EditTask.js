import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import M from 'materialize-css'
import { useParams } from 'react-router-dom'

export default function EditTask() {
    const [task, setTask] = React.useState('')
    const [expected, setExpected] = React.useState('')
    const [status, setStatus] = React.useState('Incomplete')
    const [buttonText, setButtonText] = React.useState('Update')
    const navigate = useNavigate()

    const { taskId } = useParams()

    const handleTaskChange = (e) => {
        setTask(e.target.value)
    }
    const handleDateChange = (event) => {
        setExpected(event.target.value)
    }

    React.useEffect(() => {
        M.AutoInit()
        setButtonText('Loading...')
        fetch(`http://localhost:5000/api/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tasktoken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setButtonText('Update')
                setTask(data.task)
                var date = new Date(data.expected)
                setExpected(date.toISOString().substr(0, 10))
                setStatus(data.status)
                if (data.status == 'Complete') {
                    document.getElementById('select').options[1].selected = "selected"
                } else {
                    document.getElementById('select').options[0].selected = "selected"
                }
            })
            .catch(err => {
                M.toast({ html: 'Something went wrong', classes: 'red' })
            })
    }, [])

    const handleClick = (e) => {
        e.preventDefault()
        setButtonText('Updating...')
        fetch(`http://localhost:5000/api/${taskId}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tasktoken')}`
            },
            body: JSON.stringify({
                task,
                expected,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    navigate('/Dashboard')
                } else {
                    setButtonText('Update')
                    M.toast({ html: data.message, classes: 'red' })
                }
            })
            .catch(err => {
                setButtonText('Update')
                M.toast({ html: 'Something went wrong', classes: 'red' })
            })
    }

    return (
        <>
            <Navbar />
            <form style={{ textAlign: 'center', margin: '10% auto', width: '40%' }} class="row">
                <div class="input-field col s12">
                    <input placeholder="Task" id="task" type="text" class="validate" defaultValue={task} onChange={(e) => { handleTaskChange(e) }} />
                </div>
                <div class="input-field col s12">
                    <input placeholder="Excpected Date" id="date" type="date" class="validate" defaultValue={expected} onChange={(e) => { handleDateChange(e) }} />
                </div>
                <div class="col s12">
                    <button class="btn modal-close" variant="contained" color="secondary" style={{ margin: '1rem auto', width: "15rem", backgroundColor: "#e53935" }} type="button" onClick={(e) => { handleClick(e) }}>{buttonText}</button>
                </div>
            </form>
        </>
    )
}
