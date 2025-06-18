import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailer;
    constructor(mailer: MailerService);
    sendResetPasswordEmail(to: string, link: string): Promise<void>;
}
