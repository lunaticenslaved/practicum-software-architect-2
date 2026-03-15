import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/events/health', (req: Request, res: Response) => {
    return res.status(200).json({status: true})
});

app.post('/api/events/movie', async (req: Request, res: Response) => {
    console.log('[EVENTS] Movie event')

    return res.status(201).json({ status: 'success' })
});

app.post('/api/events/user', async (req: Request, res: Response) => {
    console.log('[EVENTS] User event')

    return res.status(201).json({ status: 'success' })
});

app.post('/api/events/payment', async (req: Request, res: Response) => {
    console.log('[EVENTS] Payment event')

    return res.status(201).json({ status: 'success' })
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
