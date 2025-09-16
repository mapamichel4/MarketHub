// server/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config'; 
import authRoutes from './routes/auth';
import testRoutes from './routes/test';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' })); 

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MARCHÉHUB API is running!' });
});


app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

export default app; 