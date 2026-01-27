import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import { errors } from 'celebrate';

const app = express();
const PORT = process.env.PORT ?? 3000;

//GLOBAL MIDDLEWARES
app.use(logger);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

//PATHS GROUP CONNECTION
app.use(notesRoutes);

//404 HANDLER
app.use(notFoundHandler);

//VALIDATION ERRORS HANDLER
app.use(errors());

//OTHER ERRORS HANDLER
app.use(errorHandler);

//DB CONNECTION
await connectMongoDB();

//TURN ON A SERVER
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
