import type { NavigationPage } from './navigation.types';
import IconChat from '$assets/icons/chat.svg?component';
import IconParaphraser from '$assets/icons/paraphraser.svg?component';

export enum PageName {
  Chat = 'Chat',
  Paraphraser = 'Paraphraser',
}

export const pages: NavigationPage<PageName>[] = [
  {
    name: PageName.Chat,
    icon: IconChat,
  },
  {
    name: PageName.Paraphraser,
    icon: IconParaphraser,
  },
];
