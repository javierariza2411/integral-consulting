import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s = '') => s.replace(/[&<>"']/g, (c) => MAP[c]);

@Injectable()
export class ContactService {
  private readonly log = new Logger('Contact');

  async send(d: { name: string; email: string; phone?: string; company?: string; message: string }) {
    const to = process.env.CONTACT_TO || 'integralconsulting.sas@gmail.com';
    if (!process.env.SMTP_HOST) {
      this.log.warn(`SMTP no configurado. Mensaje de ${d.name} <${d.email}>: ${d.message.slice(0, 200)}`);
      return;
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    try {
      await transporter.sendMail({
        from: process.env.CONTACT_FROM || process.env.SMTP_USER,
        to,
        replyTo: d.email,
        subject: `Nuevo contacto web: ${d.name}${d.company ? ' · ' + d.company : ''}`,
        html: `<h3>Nuevo mensaje desde el sitio web</h3>
          <p><b>Nombre:</b> ${esc(d.name)}<br><b>Correo:</b> ${esc(d.email)}<br>
          <b>Teléfono:</b> ${esc(d.phone)}<br><b>Empresa:</b> ${esc(d.company)}</p>
          <p>${esc(d.message).replace(/\n/g, '<br>')}</p><p><i>Consentimiento de tratamiento de datos: aceptado.</i></p>`,
      });
    } catch (e) {
      this.log.error((e as Error).message);
      throw new InternalServerErrorException('No se pudo enviar el mensaje');
    }
  }
}
