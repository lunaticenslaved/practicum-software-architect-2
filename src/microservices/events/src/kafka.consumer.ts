import { Kafka, Consumer, EachMessagePayload, EachBatchPayload } from 'kafkajs';
import { kafkaConfig, TOPICS } from './kafka.config';
import { MessageConfig } from './types';

// TODO clean

export class KafkaConsumerService {
  private consumer: Consumer;
  private isConnected: boolean = false;

  constructor(groupId: string = kafkaConfig.groupId) {
    const kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers
    });

    this.consumer = kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      allowAutoTopicCreation: true
    });
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      console.log('Kafka consumer connected successfully');
    } catch (error) {
      console.error('Failed to connect Kafka consumer:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      console.log('Kafka consumer disconnected');
    } catch (error) {
      console.error('Error disconnecting consumer:', error);
    }
  }

  async subscribeToTopics(topics: string[]): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      for (const topic of topics) {
        await this.consumer.subscribe({ 
          topic, 
          fromBeginning: false 
        });
        console.log(`Subscribed to topic: ${topic}`);
      }
    } catch (error) {
      console.error('Error subscribing to topics:', error);
      throw error;
    }
  }

  async startConsuming(): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
        
        // Альтернативно можно использовать eachBatch для пакетной обработки
        // eachBatch: async (payload: EachBatchPayload) => {
        //   await this.handleBatch(payload);
        // },
        
        autoCommit: true,
        autoCommitInterval: 5000,
        autoCommitThreshold: 100
      });

      console.log('Consumer started listening for messages');
    } catch (error) {
      console.error('Error starting consumer:', error);
      throw error;
    }
  }

  private async handleMessage({ topic, partition, message }: EachMessagePayload): Promise<void> {
    try {
      if (!message.value) {
        console.warn('Received empty message');
        return;
      }

      const userMessage: MessageConfig = JSON.parse(message.value.toString());
      
      console.log({
        topic,
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        value: userMessage,
        headers: message.headers,
        timestamp: message.timestamp
      });

      // Здесь можно добавить бизнес-логику обработки сообщения
      await this.processMessage(userMessage);
      
    } catch (error) {
      console.error('Error processing message:', error);
      // Логика обработки ошибок, возможно отправка в DLQ
    }
  }

  private async processMessage(message: MessageConfig): Promise<void> {
    console.log(`Unknown action: ${message.type}`);
  }

  async pauseTopic(topic: string): Promise<void> {
    this.consumer.pause([{ topic }]);
    console.log(`Paused consumption from topic: ${topic}`);
  }

  async resumeTopic(topic: string): Promise<void> {
    this.consumer.resume([{ topic }]);
    console.log(`Resumed consumption from topic: ${topic}`);
  }
}
