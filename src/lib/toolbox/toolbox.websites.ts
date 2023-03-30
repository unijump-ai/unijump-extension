import { createGithubConfig } from './websites/github';
import { createGmailConfig } from './websites/gmail';
import { createLinkedinConfig } from './websites/linkedin';
import { createTelegramConfig } from './websites/telegram';
import { createTwitterConfig } from './websites/twitter';
import { createWhatsappConfig } from './websites/whatsapp';

export const toolboxWebsites = [
  createWhatsappConfig(),
  createTelegramConfig(),
  createGmailConfig(),
  createGithubConfig(),
  createTwitterConfig(),
  createLinkedinConfig(),
];
