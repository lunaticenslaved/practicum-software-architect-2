export type KafkaConfig = {
    clientId: string;
    brokers: string[];
    groupId: string;
} 


export const kafkaConfig: KafkaConfig = {
  clientId: 'my-app',
  brokers: [process.env.KAFKA_BROKERS ?? ''],
  groupId: 'my-group'
};

export const TOPICS = {
  USER: 'user-events',
  MOVIE: 'movie-events',
  PAYMENT: 'payment-events',
} as const;
