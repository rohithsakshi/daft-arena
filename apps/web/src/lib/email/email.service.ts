
export class EmailService {
    static async send(to: string, subject: string, body: string) {
        console.log(`[SMTP LOG] Sent email to ${to} with subject: ${subject}`);
        // In production, use nodemailer transport configured via process.env.SMTP_URL
    }
}
