import { Consumer, Kafka } from 'kafkajs';
import { MessageBroker } from '../common/MessageBroker';
import { Topics } from './eventUtils';
import { Logger } from 'winston';
import { createNotificationTransport, getLogger } from '../common/factory';
import { MessageHandler } from './messageHandler';

export class KafkaMessageBroker implements MessageBroker {
	private consumer: Consumer;
	private kafka: Kafka;
	private logger: Logger;
	private messageHandler: MessageHandler;
	constructor(clientId: string, brokers: string[]) {
		this.kafka = new Kafka({
			clientId: clientId,
			brokers: brokers,
		});
		this.consumer = this.kafka.consumer({ groupId: `${clientId}-group` });
		this.messageHandler = new MessageHandler(createNotificationTransport("email"));
		this.logger = getLogger();
	}

	async connectConsumer(): Promise<void> {
		await this.consumer.connect();
	}
	async disconnectConsumer(): Promise<void> {
		await this.consumer.disconnect();
	}
	async consumeMessages(
		topic: string[],
		fromBeginning: boolean = false
	): Promise<void> {
		await this.consumer.subscribe({
			topics: topic,
			fromBeginning: fromBeginning,
		});
		await this.consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				switch (topic) {
					case Topics.PRODUCT.toString():
						this.logger.info(message.value?.toString());
						break;
					case Topics.TOPPING.toString():
						this.logger.info(message.value?.toString());
						break;
					case Topics.ORDER.toString():
						this.logger.info(message.value?.toString());
						await this.messageHandler.consumeOrderMessage(
							topic,
							partition,
							message.value?.toString() || ''
						);
						break;
					default:
						this.logger.warn(`No handler for topic: ${topic}`);
				}
			},
		});
	}
}
