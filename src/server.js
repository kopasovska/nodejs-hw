import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:notesId', (req, res) => {
  const { userId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${userId}` });
});

app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
