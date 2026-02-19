import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { Config } from '../common';

const logDir = path.join(__dirname, '..', '..', 'logs');

const { combine, timestamp, json, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, service }) => {
    return `${timestamp} [${service}] ${level}: ${message}`;
});

const createLogger = () => {
    const isProduction = Config.NODE_ENV === 'production';

    const logger = winston.createLogger({
        level: Config.LOG.Level || 'info',
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            json()
        ),
        defaultMeta: { service: 'websocket-service' },
        transports: [
            new transports.DailyRotateFile({
                filename: path.join(logDir, Config.LOG.Application_Log_Filename),
                datePattern: Config.LOG.Date_Pattern,
                zippedArchive: Config.LOG.Zipped_Archive,
                maxSize: Config.LOG.Max_Size,
                maxFiles: Config.LOG.Max_Files,
                format: combine(
                    timestamp(),
                    json()
                )
            }),
            new transports.DailyRotateFile({
                filename: path.join(logDir, Config.LOG.Error_Log_Filename),
                level: 'error',
                datePattern: Config.LOG.Date_Pattern,
                zippedArchive: Config.LOG.Zipped_Archive,
                maxSize: Config.LOG.Max_Size,
                maxFiles: Config.LOG.Max_Files,
                format: combine(
                    timestamp(),
                    json()
                )
            })
        ],
        exceptionHandlers: [
            new transports.DailyRotateFile({
                filename: path.join(logDir, 'exceptions-%DATE%.log'),
                datePattern: Config.LOG.Date_Pattern,
                zippedArchive: Config.LOG.Zipped_Archive,
                maxSize: Config.LOG.Max_Size,
                maxFiles: Config.LOG.Max_Files,
                format: combine(
                    timestamp(),
                    json()
                )
            })
        ],
        rejectionHandlers: [
            new transports.DailyRotateFile({
                filename: path.join(logDir, 'rejections-%DATE%.log'),
                datePattern: Config.LOG.Date_Pattern,
                zippedArchive: Config.LOG.Zipped_Archive,
                maxSize: Config.LOG.Max_Size,
                maxFiles: Config.LOG.Max_Files,
                format: combine(
                    timestamp(),
                    json()
                )
            })
        ]
    });

    if (!isProduction) {
        logger.add(new transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            ),
            level: 'debug',
        }));
    } else {
        logger.add(new transports.Console({
             format: combine(
                timestamp(),
                json()
            )
        }));
    }

    return logger;
};

export default createLogger;
