const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./models/Student');

const app = express();
app.use(cors({ origin: '*' })); 
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/ace_academy')
  .then(() => console.log('MongoDB Connected to ACE Academy DB'))
  .catch(err => console.log(err));

app.post('/api/students', async (req, res) => { 
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json(newStudent);
});
app.get('/api/students', async (req, res) => { 
  const students = await Student.find();
  res.json(students);
});
app.put('/api/students/:id', async (req, res) => { 
  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedStudent);
});
app.delete('/api/students/:id', async (req, res) => { 
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Student removed' });
});

app.listen(5000, () => console.log('Backend running on port 5000'));