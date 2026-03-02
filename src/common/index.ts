import config from 'config';

export const Config = {
    APP_NAME: config.get<string>('app.name') || 'notification-service',
    PORT: config.get<number>('server.port'),
    HOST: config.get<string>('server.host'),
    URL: `http://${config.get<string>('server.host')}:${config.get<number>('server.port')}`,
    NODE_ENV: config.get<string>('NODE_ENV'),
    BROKERS: config.get<string[]>('kafka.brokers'),
    KAFKA_USERNAME: config.get<string>('kafka.username'),
    KAFKA_PASSWORD: config.get<string>('kafka.password'),
    LOG: {
        Level: config.get<string>('log.level'),
        Application_Log_Filename: config.get<string>('log.application_log_filename'),
        Error_Log_Filename: config.get<string>('log.error_log_filename'),
        Date_Pattern: config.get<string>('log.date_pattern'),
        Zipped_Archive: config.get<boolean>('log.zipped_archive'),
        Max_Size: config.get<string>('log.max_size'),
        Max_Files: config.get<string>('log.max_files')
    },
    EMAIL_HOST: config.get<string>('mail.host'),
    EMAIL_PORT: config.get<number>('mail.port'),
    EMAIL_USER: config.get<string>('mail.auth.user'),
    EMAIL_PASS: config.get<string>('mail.auth.password'),
    EMAIL_SECURE: config.get<boolean>('mail.secure'),
    EMAIL_FROM: config.get<string>('mail.from'),
};
