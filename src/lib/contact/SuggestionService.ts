export interface SuggestionDraft {
  name: string;
  contact: string;
  message: string;
}

export interface SuggestionResult {
  success: boolean;
  receivedAt: string;
}

export interface SuggestionService {
  submit(draft: SuggestionDraft): Promise<SuggestionResult>;
}

/**
 * Servicio de demostración para el formulario de sugerencias. No envía la
 * información a ningún servidor real: el destino definitivo (correo, CRM,
 * WhatsApp Business, etc.) debe ser confirmado por LILS antes de
 * producción. Ver docs/CLIENT_INFORMATION_REQUIRED.md.
 */
export class DemoSuggestionService implements SuggestionService {
  async submit(_draft: SuggestionDraft): Promise<SuggestionResult> {
    return { success: true, receivedAt: new Date().toISOString() };
  }
}

export const demoSuggestionService = new DemoSuggestionService();
