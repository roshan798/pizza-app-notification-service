import { Logger } from "winston";
import createLogger from "../logger";
import { MessageBroker } from "./MessageBroker";
import { KafkaMessageBroker } from "../utils/kafka";
import { Config } from ".";
import { MailTransport } from "../mail";

let logger: null | Logger = null;
let messageBroker: null | MessageBroker = null;
const notificationTransports: { [key in NotificationTransportType]?: any } = {};

export function getLogger() {
    if (!logger) {
        logger = createLogger();
    }
    return logger;
}

export function getMessageBroker() {
    if (!messageBroker) {
        messageBroker = new KafkaMessageBroker(Config.APP_NAME, Config.BROKERS)
    }
    return messageBroker;
}


export function createNotificationTransport(type: NotificationTransportType) {
    switch (type) {
        case "email":
            if (!notificationTransports.email) {
                notificationTransports.email = new MailTransport();
            }
            return notificationTransports.email;
        case "sms":
            throw new Error("Sms notification is not supported")
        case "push":
            throw new Error("Push notification is not supported")
        default:
            throw new Error("Invalid notification transport type")
        // return new ConsoleTransport();
    }
}
type NotificationTransportType = "email" | "sms" | "push";