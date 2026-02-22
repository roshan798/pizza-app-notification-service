import { getLogger } from "../common/factory";
import { NotificationTransport } from "../types/notification-types";
import { Order } from "../types/types";

export class MessageHandler {
    logger = getLogger()
    notificationTransport: NotificationTransport
    constructor(
        trnasport: NotificationTransport
    ) {
        this.notificationTransport = trnasport;
    }
    async consumeProductMessage(topic: string, partition: number, message: string): Promise<void> {
        console.log(message)
    }
    async consumeToppingMessage(topic: string, partition: number, message: string): Promise<void> {
        console.log(message)
    }
    async consumeOrderMessage(topic: string, partition: number, message: string): Promise<void> {
        const messageData: KafkaMessage<Order> = JSON.parse(message);
        const order = messageData.data;
        this.logger.info(`Received order message for order ID: ${order.id}, customer ID: ${order.customerId}`);
        const emailContent = this.buildEmailContent(order);
        await this.notificationTransport.send({
            to: 'customer@mail.com',
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        });
    }
    private buildEmailContent(order: Order) {
        const subject = `Your order ${order.id} has been received!`;
        const text = `Thank you for your order! Your order with ID ${order.id} has been received and is being processed.`;
        return { subject, text, html: this.buildEmailHtmlContent(order) };
    }
    private buildEmailHtmlContent(order: Order): string {
        return `
            <h1>Thank you for your order!</h1>
            <p>Your order with ID ${order.id} has been received and is being processed.</p>
        `;
    }
}


interface KafkaMessage<T> {
    event_type: string;
    data: T;
}
