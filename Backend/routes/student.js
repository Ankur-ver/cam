const express=require('express');
const router=express.Router();
const Student=require('../model/student')
const { fetchCFData } = require('../services/codeforces');
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, codeforcesHandle } = req.body;

    const existing = await Student.findOne({ codeforcesHandle });
    if (existing) return res.status(409).json({ message: "Handle already exists" });

    const student = new Student({ name, email, phone, codeforcesHandle });
    const cfData = await fetchCFData(codeforcesHandle);
    console.log(cfData);
    Object.assign(student, cfData);

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error('Error creating student:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;