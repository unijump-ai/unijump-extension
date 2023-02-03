import type { ComponentType } from 'svelte';

export interface NavigationPage<PageNameEnum> {
  name: PageNameEnum;
  icon: ComponentType;
}
