import { createTelegramConfig } from './websites/telegram';
import { createWhatsappConfig } from './websites/whatsapp';

export const toolboxWebsites = [createWhatsappConfig(), createTelegramConfig()];
