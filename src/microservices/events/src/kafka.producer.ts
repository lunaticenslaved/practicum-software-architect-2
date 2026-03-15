import { Kafka, Producer, ProducerRecord, Message } from 'kafkajs';
import { kafkaConfig, TOPICS } from './kafka.config';
import { MessageConfig } from './types';

// TODO clean
export class KafkaProducerService {
  private producer: Producer;
  private isConnected: boolean = false;

  constructor() {
    const kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers
    });

    this.producer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000
    });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka producer connected successfully');
    } catch (error) {
      console.error('Failed to connect Kafka producer:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka producer disconnected');
    } catch (error) {
      console.error('Error disconnecting producer:', error);
    }
  }

  async sendMessage(topic: string, message: MessageConfig): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const record: ProducerRecord = {
        topic,
        messages: [
          {
            value: JSON.stringify(message),
            headers: {
              'content-type': 'application/json',
              'source': kafkaConfig.clientId
            },
            timestamp: new Date().getTime().toString()
          }
        ]
      };

      const result = await this.producer.send(record);
      console.log(`Message sent to ${topic}:`, result);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendBatchMessages(topic: string, messages: MessageConfig[]): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const kafkaMessages: Message[] = messages.map(msg => ({
        value: JSON.stringify(msg),
        headers: {
          'content-type': 'application/json',
          'batch': 'true'
        }
      }));

      const record: ProducerRecord = {
        topic,
        messages: kafkaMessages
      };

      const result = await this.producer.send(record);
      console.log(`Batch of ${messages.length} messages sent:`, result);
    } catch (error) {
      console.error('Error sending batch messages:', error);
      throw error;
    }
  }
}
