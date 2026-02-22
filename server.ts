import { getLogger, getMessageBroker } from "./src/common/factory";
import { MessageBroker } from "./src/common/MessageBroker";
import { Topics } from "./src/utils/eventUtils";

const startServer = async () => {
    let broker: MessageBroker | null = null;
    const logger = getLogger();
    try {
        broker = getMessageBroker();
        await broker.connectConsumer();
        await broker.consumeMessages([Topics.ORDER], false);

        
    } catch (err) {
        logger.error("Error happened: ", err);
        if (broker) {
            await broker.disconnectConsumer();
        }
        process.exit(1);
    }
};

void startServer();