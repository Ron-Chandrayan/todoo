import React, { useState , useEffect} from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {

  const [tasks, setTasks] = useState([]);

  // centralized fetch so it can be re-used after mutations
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  // Load tasks from backend on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const[description, setDescription]=useState("");
  const[deadline,setDeadline]=useState("");
  // const[hour,setHour]=useState();
  // const[day,setDay]=useState();
  // const[min,setMin]=useState();
  // const[sec,setSec]=useState();

  // Add a new task (POST)
  // const addTask = async (e) => {
  //   if (e && e.preventDefault) e.preventDefault();
  //   if (!description?.trim()) return;
  //   try {
  //     const payload = { description: description.trim(), deadline: deadline || null, completed: false };
  //     const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/tasks`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload)
  //     });
  //     if (!res.ok) throw new Error('Failed to create task');
  //     const created = await res.json();
  //     // append created task to state (backend should return created item with id)
  //     setTasks(prev => [...prev, created]);
  //     setDescription('');
  //     setDeadline('');
  //   } catch (err) {
  //     console.error('Error adding task:', err);
  //   }
  //};

  //Update an existing task (PUT)
  // const updateTask = async (id, updates) => {
  //   try {
  //     const res = await fetch(`http://localhost:5000/tasks/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(updates)
  //     });
  //     if (!res.ok) throw new Error('Failed to update task');
  //     const updated = await res.json();
  //     setTasks(prev => prev.map(t => (t._id === updated._id || t.id === updated.id ? updated : t)));
  //   } catch (err) {
  //     console.error('Error updating task:', err);
  //   }
 // };

  //Delete a task (DELETE)
  // const deleteTask = async (id) => {
  //   try {
  //     const res = await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
  //     if (!res.ok) throw new Error('Failed to delete task');
  //     setTasks(prev => prev.filter(t => (t._id || t.id) !== id));
  //   } catch (err) {
  //     console.error('Error deleting task:', err);
  //   }
  // };

  // Toggle completion (uses updateTask)
  // const toggleComplete = async (id) => {
  //   const task = tasks.find(t => (t._id || t.id) === id);
  //   if (!task) return;
  //   const updates = { ...task, completed: !task.completed };
  //   // Use updateTask to persist
  //   await updateTask(id, updates);
  // };

  return (
    <>
    <Header/>
    <Outlet context={{
      tasks,
      setTasks,
      description,
      setDescription,
      deadline,
      setDeadline,
      fetchTasks,
    }} />
    <Footer/>
    </>
  )
}

export default Layout
