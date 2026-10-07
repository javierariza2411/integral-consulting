'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('sending');
    try {
      const r = await fetch('/backend/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), email: f.get('email'), phone: f.get('phone') || undefined, company: f.get('company') || undefined,
          message: f.get('message'), consent: f.get('consent') === 'on', website: f.get('website') || undefined,
        }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(Array.isArray(j.message) ? j.message[0] : j.message || 'Error al enviar');
      }
      setState('ok');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setMsg((err as Error).message);
      setState('error');
    }
  }

  if (state === 'ok') return <div className="card" role="status"><p className="text-lg font-semibold text-gold-400">¡Gracias por escribirnos!</p><p className="mt-2 text-silver-300">Recibimos tu mensaje y te responderemos en el menor tiempo posible.</p></div>;

  return (
    <form onSubmit={onSubmit} className="card space-y-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">Nombre *</label><input id="name" name="name" required minLength={2} className="input" autoComplete="name" /></div>
        <div><label className="label" htmlFor="email">Correo *</label><input id="email" name="email" type="email" required className="input" autoComplete="email" /></div>
        <div><label className="label" htmlFor="phone">Teléfono</label><input id="phone" name="phone" className="input" autoComplete="tel" /></div>
        <div><label className="label" htmlFor="company">Organización</label><input id="company" name="company" className="input" autoComplete="organization" /></div>
      </div>
      <div><label className="label" htmlFor="message">¿Qué necesita proteger, ordenar o transformar? *</label><textarea id="message" name="message" required minLength={10} rows={5} className="input" /></div>
      <div className="hidden" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="flex items-start gap-3 text-sm text-silver-300">
        <input type="checkbox" name="consent" required className="mt-1 accent-[#C9A24B]" />
        <span>Autorizo el tratamiento de mis datos personales conforme a la <Link href="/legal/privacidad" className="text-gold-400 underline">política de privacidad</Link>.</span>
      </label>
      {state === 'error' && <p role="alert" className="text-sm text-down">{msg}</p>}
      <button className="btn-gold w-full sm:w-auto" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : 'Enviar mensaje'}</button>
    </form>
  );
}
