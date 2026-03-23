import express, { Request, Response } from 'express';
import { KafkaProducerService } from './kafka.producer';
import { TOPICS } from './kafka.config';
import { KafkaConsumerService } from './kafka.consumer';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const kafkaProducer = new KafkaProducerService();

app.get('/api/events/health', (req: Request, res: Response) => {
    return res.status(200).json({status: true})
});

app.post('/api/events/movie', async (req: Request, res: Response) => {
    await kafkaProducer.sendMessage(TOPICS.MOVIE, {type: 'movie'})

    return res.status(201).json({ status: 'success' })
});

app.post('/api/events/user', async (req: Request, res: Response) => {
    await kafkaProducer.sendMessage(TOPICS.USER, {type: 'user'})

    return res.status(201).json({ status: 'success' })
});

app.post('/api/events/payment', async (req: Request, res: Response) => {
    await kafkaProducer.sendMessage(TOPICS.PAYMENT, {type: 'payment'})

    return res.status(201).json({ status: 'success' })
});

app.listen(PORT, async () => {
    await kafkaProducer.connect();

    const kafkaConsumer = new KafkaConsumerService();
    await kafkaConsumer.connect();

    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
