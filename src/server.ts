
import express from 'express';
import cors from 'cors';
import connectDB from './db/connection';
import Semester from './db/models/Semester';
import Subject from './db/models/Subject';
import PDF from './db/models/PDF';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Semesters
app.get('/api/semesters', async (req, res) => {
  try {
    const semesters = await Semester.find().sort({ name: 1 });
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/semesters', async (req, res) => {
  try {
    const { name } = req.body;
    const newSemester = new Semester({ name });
    await newSemester.save();
    res.status(201).json(newSemester);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

app.put('/api/semesters/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const semester = await Semester.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    res.json(semester);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

app.delete('/api/semesters/:id', async (req, res) => {
  try {
    const semester = await Semester.findByIdAndDelete(req.params.id);
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    res.json({ message: 'Semester deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

// Subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const { semesterId } = req.query;
    let subjects;
    if (semesterId) {
      subjects = await Subject.find({ semesterId }).sort({ name: 1 });
    } else {
      subjects = await Subject.find().sort({ name: 1 });
    }
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const { name, semesterId } = req.body;
    const newSubject = new Subject({ name, semesterId });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

app.put('/api/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

app.delete('/api/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

// PDFs
app.get('/api/pdfs', async (req, res) => {
  try {
    const { subjectId, semesterId } = req.query;
    let pdfs;
    if (subjectId) {
      pdfs = await PDF.find({ subjectId }).sort({ createdAt: -1 });
    } else if (semesterId) {
      pdfs = await PDF.find({ semesterId }).sort({ createdAt: -1 });
    } else {
      pdfs = await PDF.find().sort({ createdAt: -1 });
    }
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/pdfs', async (req, res) => {
  try {
    const newPDF = new PDF(req.body);
    await newPDF.save();
    res.status(201).json(newPDF);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

app.put('/api/pdfs/:id', async (req, res) => {
  try {
    const pdf = await PDF.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    res.json(pdf);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

app.delete('/api/pdfs/:id', async (req, res) => {
  try {
    const pdf = await PDF.findByIdAndDelete(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    res.json({ message: 'PDF deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error });
  }
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
