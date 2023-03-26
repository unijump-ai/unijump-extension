import { createGithubConfig } from './websites/github';
import { createGmailConfig } from './websites/gmail';
import { createTelegramConfig } from './websites/telegram';
import { createWhatsappConfig } from './websites/whatsapp';

export const toolboxWebsites = [
  createWhatsappConfig(),
  createTelegramConfig(),
  createGmailConfig(),
  createGithubConfig(),
];
