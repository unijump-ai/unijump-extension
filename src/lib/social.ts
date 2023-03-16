import IconDiscord from '$assets/icons/social/discord.svg?component';
import IconTelegram from '$assets/icons/social/telegram.svg?component';
import IconTwitter from '$assets/icons/social/twitter.svg?component';
import type { SvelteComponent } from 'svelte';

interface SocialLink {
  name: string;
  href: string;
  icon: typeof SvelteComponent;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/unijump_ai',
    icon: IconTwitter,
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/adXsUw8e5j',
    icon: IconDiscord,
  },
  {
    name: 'Telegram',
    href: 'https://t.me/+CDBtdXUd1XJhNzhk',
    icon: IconTelegram,
  },
];
