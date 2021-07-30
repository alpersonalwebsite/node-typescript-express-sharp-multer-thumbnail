import express, { Request, Response } from 'express';
import routes from './routes/index';

const app = express();
const port = 5000;

app.use('/api', routes);

app.all('*', (req: Request, res: Response): void => {
  res.status(404).json({
    message: 'Resource Not Found'
  });
});

app.listen(port, (): void => {
  console.log(`Server running at localhost:${port}`);
});

export default app;
