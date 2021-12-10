import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserContext } from '../App'
import Navbar from '../components/Navbar'
import M from 'materialize-css'

export default function Dashboard() {
    const { state, dispatch } = React.useContext(UserContext)
    const [tasklist, setTasklist] = React.useState(null)
    const [forceUpdate, setForceUpdate] = React.useState(0)
    const navigate = useNavigate()

    const handleStatusChange = (e, id) => {
        fetch(`http://localhost:5000/api/${id}/updateStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tasktoken')}`
            },
            body: JSON.stringify({
                status: e.target.value ? "Complete" : "Incomplete"
            })
        })
            .then(res => res.json())
            .then(data => {
                setForceUpdate(forceUpdate + 1)
            })
            .catch(err => {
                M.toast({ html: err, classes: "red" })
            })
    }

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/api/${id}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tasktoken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setForceUpdate(forceUpdate + 1)
            })
            .catch(err => setForceUpdate(forceUpdate + 1))

    }

    React.useEffect(() => {
        if (!state) {
            navigate('/')
        }
        fetch('http://localhost:5000/api/tasklist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('tasktoken')
            }
        })
            .then(res => res.json())
            .then(data => {
                setTasklist(data)
            })
            .catch(err => {
                M.toast({ html: "Something went wrong", classes: "red" })
            })
    }, [forceUpdate])
    return (
        <>
            <Navbar />
            <div className="container" style={{ width: "80%", margin: '2rem 10%' }}>
                <p style={{ color: '#555555', fontSize: '1.2rem', margin: '0.3rem 0' }}>Hello {state ? state.name : null},</p>
                <p style={{ color: '#555555', fontSize: '1.5rem', margin: '0.3rem 0' }}>Here are all your tasks</p>
                <button style={{ float: 'right', margin: "1rem 0", backgroundColor: "#e53935" }} className="btn" onClick={() => { navigate('/createTask') }}>Create Task</button>
                <table>
                    <thead>
                        <tr>
                            <th className="center">Task</th>
                            <th className="center">Expected Date</th>
                            <th className="center">Status</th>
                            <th className="center"></th>
                            <th className="center"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            tasklist ?
                                tasklist.map(task => {
                                    return (
                                        <tr key={task._id}>
                                            <td className="center">{task.task}</td>
                                            <td className="center">{task.expected.split("", 10)}</td>
                                            <td className="center"><label><input type="checkbox" class="filled-in" defaultChecked={task.status == "Complete" ? true : false} onChange={(e) => { handleStatusChange(e, task._id) }} /><span></span>
                                            </label></td>
                                            <td className="center"><Link to={`/editTask/${task._id}`}><button className="btn" style={{ backgroundColor: "#4caf50" }}><i className="material-icons">edit</i></button></Link></td>
                                            <td className="center"><button className="btn" style={{ backgroundColor: "#e53935" }} onClick={(e) => { handleDelete(task._id) }}><i className="material-icons">delete</i></button></td>
                                        </tr>
                                    )
                                }) :
                                "Loading..."
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}