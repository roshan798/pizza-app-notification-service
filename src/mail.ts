import { NotificationTransport } from "./types/notification-types";
import { getLogger } from "./common/factory";
import nodemailer from "nodemailer";
import { Config } from "./common";

export class MailTransport implements NotificationTransport {
    private readonly logger = getLogger();
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: Config.EMAIL_HOST,
            port: Number(Config.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: Config.EMAIL_USER,
                pass: Config.EMAIL_PASS,
            },
        });
    }
    async send(message: { to: string; text: string; subject?: string; html?: string }): Promise<void> {
        this.logger.debug(`Sending email to ${message.to} with subject "${message.subject}"`);
        const info = await this.transporter.sendMail({
            from: Config.EMAIL_FROM,
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html,
        });
        this.logger.debug(`Email sent to ${message.to} with subject "${message.subject}"`);
        this.logger.info(`Email sent: ${info.messageId}`);
    }

}
