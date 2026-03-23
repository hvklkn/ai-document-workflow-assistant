import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.js';
import documentRoutes from './routes/documents.js';
import workflowRoutes from './routes/workflows.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------- Routes ---------------
app.use('/api/health', healthRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/workflows', workflowRoutes);

// --------------- Error Handling ---------------
app.use(errorHandler);

export default app;
