import { Logger } from "winston";
import createLogger from "../logger";
import { MessageBroker } from "./MessageBroker";
import { KafkaMessageBroker } from "../utils/kafka";
import { Config } from ".";

let logger: null | Logger = null;
let messageBroker: null | MessageBroker = null;

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


