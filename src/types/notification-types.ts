export interface Message {
    to: string;
    text: string;
    subject?: string;
    html?: string;
}

export interface NotificationTransport {
    send(message: Message): Promise<void>;
}