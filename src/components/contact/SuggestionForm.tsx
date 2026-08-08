'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { demoSuggestionService } from '@/lib/contact/SuggestionService';

export function SuggestionForm() {
  const formId = useId();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) {
      setError('Escribe tu sugerencia antes de enviarla.');
      return;
    }
    setError(null);
    setStatus('sending');
    await demoSuggestionService.submit({ name, contact, message });
    setStatus('sent');
  }

  function handleNewSuggestion() {
    setName('');
    setContact('');
    setMessage('');
    setStatus('idle');
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="lils-card p-6 text-center"
      >
        <p className="font-display text-xl font-extrabold text-brand-blue">¡Gracias por tu sugerencia!</p>
        <p className="mt-2 text-sm text-brand-black/70">
          Esto es una demostración: tu mensaje no fue enviado a un servidor real. El destino
          definitivo de las sugerencias está pendiente de confirmación por LILS.
        </p>
        <button
          type="button"
          onClick={handleNewSuggestion}
          className="lils-button-primary mt-4 text-sm"
        >
          Enviar otra sugerencia
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor={`${formId}-name`} className="text-sm font-bold text-brand-black">
          Nombre (opcional)
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-contact`} className="text-sm font-bold text-brand-black">
          Teléfono o correo (opcional)
        </label>
        <input
          id={`${formId}-contact`}
          type="text"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="text-sm font-bold text-brand-black">
          Tu sugerencia <span aria-hidden="true">*</span>
          <span className="sr-only">(obligatorio)</span>
        </label>
        <textarea
          id={`${formId}-message`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          required
          aria-required="true"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${formId}-error` : undefined}
          className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
        />
      </div>

      {error ? (
        <p id={`${formId}-error`} role="alert" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="lils-button-primary w-full py-3"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar sugerencia'}
      </button>
    </form>
  );
}
