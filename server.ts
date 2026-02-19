import ws from "./src/socket";
import { getLogger, getMessageBroker } from "./src/common/factory";
import { MessageBroker } from "./src/common/MessageBroker";
import { Topics } from "./src/utils/eventUtils";
import { Events } from "./src/types/socketEvents";
import { Config } from "./src/common";

const startServer = async () => {
    let broker: MessageBroker | null = null;
    const logger = getLogger();
    try {
        broker = getMessageBroker();
        await broker.connectConsumer();
        await broker.consumeMessages([Topics.ORDER], true);

        ws.wsServer
            .listen(Config.PORT, () => {
                console.log(`Listening on port ${Config.PORT}`);
            })
            .on(Events.ERROR, (err) => {
                console.log("err", err.message);
                process.exit(1);
            });
    } catch (err) {
        logger.error("Error happened: ", err);
        if (broker) {
            await broker.disconnectConsumer();
        }
        process.exit(1);
    }
};

void startServer();