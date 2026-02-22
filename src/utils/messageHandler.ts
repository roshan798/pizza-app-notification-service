import { getLogger } from "../common/factory";
import { NotificationTransport } from "../types/notification-types";
import { Order } from "../types/types";
import { OrderEvents } from "./eventUtils";
type EmailContent = {
    subject: string;
    text: string;
    html: string;
}
const emailTemaplates = {
    [OrderEvents.ORDER_CREATE]: {
        builtMailContent: (order: Order): EmailContent => {
            const subject = `Your order ${order.id} has been received!`;
            const text = `Thank you for your order! Your order with ID ${order.id} has been received and is being processed.`;
            const html = `
                <h1>Thank you for your order!</h1>
                <p>Your order with ID ${order.id} has been received and is being processed.</p>
            `;
            return { subject, text, html };
        }
    },
    [OrderEvents.ORDER_STATUS_UPDATE]: {
        builtMailContent: (order: Order): EmailContent => {
            const subject = `Your order ${order.id} status has been updated!`;
            const text = `Your order with ID ${order.id} status has been updated to ${order.orderStatus}.`;
            const html = `
                <h1>Your order status has been updated!</h1>
                <p>Your order with ID ${order.id} status has been updated to ${order.orderStatus}.</p>
            `;
            return { subject, text, html };
        }
    },
    [OrderEvents.ORDER_PAYMENT_STATUS_UPDATE]: {
        builtMailContent: (order: Order) => {
            const subject = `Your order ${order.id} payment status has been updated!`;
            const text = `Your order with ID ${order.id} payment status has been updated to ${order.paymentStatus}.`;
            const html = `
                <h1>Your order payment status has been updated!</h1>
                <p>Your order with ID ${order.id} payment status has been updated to ${order.paymentStatus}.</p>
            `;
            return { subject, text, html };
        }
    }
}

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
        const eventType = messageData.event_type;
        if (eventType === OrderEvents.ORDER_CREATE) {
            await this.handleOrderCreated(eventType, order);
        } else {
            this.logger.warn(`Unhandled event type: ${eventType}`);
        }
    }
    private async handleOrderCreated(eventType: string, order: Order): Promise<void> {
        this.logger.info(`Handling order created event for order ID: ${order.id}`);
        const emailContent = this.buildEmailContent(eventType, order);
        await this.notificationTransport.send({
            to: order.customerEmail || order.customerId, 
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        });
    }

    private buildEmailContent(eventType: string, order: Order) {
        if (eventType == OrderEvents.ORDER_CREATE) {
            return emailTemaplates[OrderEvents.ORDER_CREATE].builtMailContent(order);
        } else if (eventType === OrderEvents.ORDER_STATUS_UPDATE) {
            return emailTemaplates[OrderEvents.ORDER_STATUS_UPDATE].builtMailContent(order);
        } else if (eventType === OrderEvents.ORDER_PAYMENT_STATUS_UPDATE) {
            return emailTemaplates[OrderEvents.ORDER_PAYMENT_STATUS_UPDATE].builtMailContent(order);
        } else {
            throw new Error(`Unhandled event type: ${eventType}`);
        }
    }
}


interface KafkaMessage<T> {
    event_type: string;
    data: T;
}
