import type { Metadata } from 'next';
import { business } from '@/data/business';
import { SuggestionForm } from '@/components/contact/SuggestionForm';

export const metadata: Metadata = {
  title: 'Sugerencias y contacto — LILS Burger',
  description: 'Envíanos tus sugerencias sobre LILS Burger.',
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-black md:text-4xl">
        Sugerencias y contacto
      </h1>
      <p className="mt-2 text-brand-black/70">
        ¿Tienes una idea, comentario o algo que podamos mejorar? Cuéntanos. También puedes
        escribirnos por WhatsApp al {business.phoneDisplay}.
      </p>

      <div className="mt-6">
        <SuggestionForm />
      </div>
    </div>
  );
}
