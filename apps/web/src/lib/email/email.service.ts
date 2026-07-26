import nodemailer from 'nodemailer';
import { config } from '../config';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: parseInt(config.SMTP_PORT),
        secure: parseInt(config.SMTP_PORT) === 465,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS,
        },
    });

    static async send(to: string, subject: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: config.SMTP_FROM,
                to,
                subject,
                html,
            });
            console.log(`[SMTP LOG] Sent email to ${to} with subject: ${subject}`);
        } catch (error) {
            console.error('[SMTP ERROR] Failed to send email:', error);
        }
    }

    static async sendTemplate(to: string, templateName: 'REGISTRATION_SUCCESS' | 'PAYMENT_APPROVED' | 'PAYMENT_REJECTED', data: any) {
        const templates = {
            REGISTRATION_SUCCESS: {
                subject: 'Registration Successful - DAFT Arena',
                html: `<h1>Registration Confirmed</h1><p>You have successfully registered for the tournament.</p>`
            },
            PAYMENT_APPROVED: {
                subject: 'Payment Approved - DAFT Arena',
                html: `<h1>Payment Approved</h1><p>Your payment for tournament entry has been approved. You are now officially enrolled.</p>`
            },
            PAYMENT_REJECTED: {
                subject: 'Payment Rejected - DAFT Arena',
                html: `<h1>Payment Rejected</h1><p>Your payment could not be verified. Please submit a valid UTR or screenshot.</p>`
            }
        };

        const template = templates[templateName];
        if (template) {
            await this.send(to, template.subject, template.html);
        }
    }
}

