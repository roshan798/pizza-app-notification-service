import { createServer } from "node:http";
import { Server } from "socket.io";
import { Events } from "./types/socketEvents";
import { getLogger } from "./common/factory";
import { Config } from "./common";

const logger = getLogger()
const wsServer = createServer();

const ALLOWED_DOMAINS = Config.CLIENT_URLS;


const io = new Server(wsServer, { cors: { origin: ALLOWED_DOMAINS } });

io.on(Events.CONNECTION, (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on(Events.JOIN, (data) => {
        socket.join(String(data.tenantId));

        socket.emit(Events.JOIN, { roomId: String(data.tenantId) });
    });
});

export default {
    wsServer,
    io,
};