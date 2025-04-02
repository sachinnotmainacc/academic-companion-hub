
import express from 'express';
import cors from 'cors';
import connectDB from './db/connection';
import Semester from './db/models/Semester';
import Subject from './db/models/Subject';
import PDF from './db/models/PDF';
import Notes from './db/models/Notes';
import fs from 'fs';
import path from 'path';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Notes JSON file path
const notesFilePath = path.join(process.cwd(), 'data', 'notes.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(notesFilePath))) {
  fs.mkdirSync(path.dirname(notesFilePath), { recursive: true });
}

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
    
    // Update notes.json when a new PDF is added
    try {
      // Read existing notes data
      let notesData;
      if (fs.existsSync(notesFilePath)) {
        const fileData = fs.readFileSync(notesFilePath, 'utf8');
        notesData = JSON.parse(fileData);
      } else {
        notesData = {
          semesters: [],
          searchIndex: { subjects: {} }
        };
      }
      
      // Find or create semester
      const { semesterId, subjectId, title, fileName, fileUrl } = req.body;
      
      // Get semester and subject names
      const semesterDoc = await Semester.findById(semesterId);
      const subjectDoc = await Subject.findById(subjectId);
      
      if (!semesterDoc || !subjectDoc) {
        console.log('Semester or subject not found, skipping notes.json update');
      } else {
        const semesterName = semesterDoc.name;
        const subjectName = subjectDoc.name;
        
        // Convert semesterId string to number for notes structure
        const semesterIdNum = parseInt(semesterName.match(/\d+/)?.[0] || '1', 10);
        
        // Find or create semester in notes data
        let semester = notesData.semesters.find(sem => sem.id === semesterIdNum);
        if (!semester) {
          semester = {
            id: semesterIdNum,
            name: semesterName,
            branches: []
          };
          notesData.semesters.push(semester);
          notesData.semesters.sort((a, b) => a.id - b.id);
        }
        
        // Find or create CSE branch
        let branch = semester.branches.find(b => b.id === 'cse');
        if (!branch) {
          branch = {
            id: 'cse',
            name: 'Computer Science and Engineering',
            subjects: []
          };
          semester.branches.push(branch);
        }
        
        // Find or create subject
        let subject = branch.subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
        if (!subject) {
          // Create a simple subject ID from the name
          const subjectId = subjectName.toLowerCase().replace(/\s+/g, '') + semesterIdNum;
          subject = {
            id: subjectId,
            name: subjectName,
            materials: []
          };
          branch.subjects.push(subject);
          
          // Update search index
          if (!notesData.searchIndex.subjects[subjectName.toLowerCase()]) {
            notesData.searchIndex.subjects[subjectName.toLowerCase()] = [];
          }
          notesData.searchIndex.subjects[subjectName.toLowerCase()].push(subjectId);
        }
        
        // Add the new material
        const material = {
          title: title,
          description: `${title} for ${subjectName}`,
          path: `/data/notes/semester-${semesterIdNum}/cse/${subjectName.toLowerCase()}/${fileName}`,
          type: 'pdf',
          size: '2.4MB', // Placeholder size
          uploadDate: new Date().toISOString().split('T')[0],
          downloadUrl: fileUrl,
          keywords: [subjectName.toLowerCase(), title.toLowerCase()]
        };
        
        subject.materials.push(material);
        
        // Save updated notes data
        fs.writeFileSync(notesFilePath, JSON.stringify(notesData, null, 2));
        console.log('Notes JSON updated successfully');
      }
    } catch (error) {
      console.error('Error updating notes.json:', error);
    }
    
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

// Notes API endpoints
app.get('/api/notes', async (req, res) => {
  try {
    let notesData;
    
    // First check if notes.json exists
    if (fs.existsSync(notesFilePath)) {
      const fileData = fs.readFileSync(notesFilePath, 'utf8');
      notesData = JSON.parse(fileData);
    } else {
      // If not, check MongoDB
      const notesDoc = await Notes.findOne();
      
      if (notesDoc) {
        notesData = notesDoc.toObject();
      } else {
        // Create default structure
        notesData = {
          semesters: [],
          searchIndex: { subjects: {} }
        };
        
        // Save to file
        fs.writeFileSync(notesFilePath, JSON.stringify(notesData, null, 2));
        
        // Save to MongoDB
        const newNotesDoc = new Notes(notesData);
        await newNotesDoc.save();
      }
    }
    
    res.json(notesData);
  } catch (error) {
    console.error('Error getting notes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const notesData = req.body;
    
    // Update MongoDB
    await Notes.findOneAndUpdate({}, notesData, { upsert: true });
    
    // Update JSON file
    fs.writeFileSync(notesFilePath, JSON.stringify(notesData, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
