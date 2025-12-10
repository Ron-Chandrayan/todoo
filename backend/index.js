const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT ;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Task schema
const taskSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    description: { type: String, required: true },
    deadline: { type: String },
    isDone: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({}).sort({ createdAt: -1 }).lean();
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a task
app.post('/tasks', async (req, res) => {
    try {
        // accept either isDone or completed from client
        const { id, description, deadline } = req.body;
        let isDone = req.body.isDone;
        if (req.body.completed !== undefined) isDone = !!req.body.completed;

        const taskId = id || Date.now();
        const newTask = new Task({ id: taskId, description, deadline, isDone: !!isDone });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            // duplicate id
            return res.status(409).json({ error: 'Task with this id already exists' });
        }
        res.status(500).json({ error: 'Failed to create task' });
    }
});


// delete a task
app.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
    console.log(typeof(id));
    await Task.deleteOne({id:id});
    res.json({message:"success"});
    } catch (error) {
    res.json({message:"failure"});
    } 
})

app.post('/update', async (req, res) => {
    try {
        const { id } = req.body;
    console.log(typeof(id));
    const task = await Task.findOne({id:id})
    task.isDone = !task.isDone
    await task.save();
    res.json({message:"successssss"});
    } catch (error) {
     
    res.json({message:"failure"});
    } 
})

const url = `https://todoapp-ihoy.onrender.com/`; // Replace with your Render URL
const interval = 30000; // Interval in milliseconds (30 seconds)

function reloadWebsite() {
  fetch(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}


setInterval(reloadWebsite, interval);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});