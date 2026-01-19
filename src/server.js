import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { Student } from './models/student.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

//GLOBAL MIDDLEWARES
app.use(logger);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

//PATHS
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

//-------------------------
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
});

app.get('/students/:studentID', async (req, res) => {
  const { studentID } = req.params;
  const student = await Student.findById(studentID);

  if (!student) {
    res.status(404).json({ message: 'Student not found!' });
  }
  res.status(200).json(student);
});

//-------------------------

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

//404 HANDLER
app.use(notFoundHandler);

//ERRORS HANDLER
app.use(errorHandler);

//DB CONNECTION
await connectMongoDB();

//TURN ON A SERVER
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
