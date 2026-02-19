import { Consumer, Kafka } from 'kafkajs';
import { MessageBroker } from '../common/MessageBroker';
import { Topics } from './eventUtils';
import { Logger } from 'winston';
import { getLogger } from '../common/factory';

export class KafkaMessageBroker implements MessageBroker {
	private consumer: Consumer;
	private kafka: Kafka;
	private logger: Logger;
	constructor(clientId: string, brokers: string[]) {
		this.kafka = new Kafka({
			clientId: clientId,
			brokers: brokers,
		});
		this.consumer = this.kafka.consumer({ groupId: `${clientId}-group` });
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
		fromBeginning: boolean = true
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
						// await consumeProductMessageHandler(
						// 	topic,
						// 	partition,
						// 	message.value?.toString()
						// );
						break;
					case Topics.TOPPING.toString():
						this.logger.info(message.value?.toString());

						// await consumeToppingMessageHandler(
						// 	topic,
						// 	partition,
						// 	message.value?.toString()
						// );
						break;
					case Topics.ORDER.toString():
						this.logger.info(message.value?.toString());
						// await consumeOrderMessageHandler(
						// 	topic,
						// 	partition,
						// 	message.value?.toString()
						// )
						break;
					default:
						this.logger.warn(`No handler for topic: ${topic}`);
				}
			},
		});
	}
}
