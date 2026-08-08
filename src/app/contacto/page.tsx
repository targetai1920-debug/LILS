import type { Metadata } from 'next';
import { business } from '@/data/business';
import { SuggestionForm } from '@/components/contact/SuggestionForm';

export const metadata: Metadata = {
  title: 'Sugerencias y contacto — LILS Burger',
  description: 'Envíanos tus sugerencias sobre LILS Burger.',
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <header className="blueprint-pattern rounded-[2.5rem] px-6 py-9 text-brand-white shadow-[0_22px_55px_rgba(23,37,119,0.20)] md:px-10">
        <span className="lils-kicker border-brand-white/20 bg-brand-white/10 text-brand-white">Hablemos</span>
        <h1 className="font-display mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">Sugerencias y contacto</h1>
      </header>
      <p className="mt-6 text-brand-black/70">
        ¿Tienes una idea, comentario o algo que podamos mejorar? Cuéntanos. También puedes
        escribirnos por WhatsApp al {business.phoneDisplay}.
      </p>

      <div className="lils-surface mt-6 p-5 md:p-7">
        <SuggestionForm />
      </div>
    </div>
  );
}
