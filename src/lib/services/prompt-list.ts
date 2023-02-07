import { parseCSV } from '$lib/csv';
import { Cache } from '$lib/decorators/cache.method';
import { ExtensionStorage } from '$lib/extension/storage';
import promptLists from '$lib/prompt-lists';
import type { PromptListConfig } from '$lib/prompt-lists/prompt-list.types';
import { createArrayStore } from '$lib/store/arrayStore';
import { syncedWritable } from '$lib/store/syncedWritable';
import { get } from 'svelte/store';
import { StoreService } from './store';

export interface ListPrompt {
  title: string;
  prompt: string;
  list: string;
}

interface PromptListState {
  prompts: ListPrompt[];
  isLoading: boolean;
}

const favoritePromptsStorage = new ExtensionStorage<string[]>('favoritePrompts');

class PromptListService extends StoreService<PromptListState> {
  lists = promptLists;
  prompts: ListPrompt[] = [];
  searchText = '';
  isLoading = true;
  favoritePrompts = syncedWritable(createArrayStore<string>([]), (value: string[]) =>
    favoritePromptsStorage.set(value)
  );

  constructor() {
    super(null);
    this.setStore();
    this.init();
  }

  private get state() {
    return {
      prompts: this.applyFilters(this.prompts),
      isLoading: this.isLoading,
    };
  }

  search(text: string) {
    this.searchText = text;
    this.setStore();
  }

  private setStore() {
    this.setState(this.state);
  }

  private async init() {
    const favoritePrompts = await favoritePromptsStorage.get();

    if (favoritePrompts) {
      this.favoritePrompts.addMany(favoritePrompts);
    }

    this.favoritePrompts.startSync();
    this.isLoading = true;
    this.setStore();

    const prompts = await this.fetchLists();
    this.addPrompts(prompts);
    this.isLoading = false;
    this.setStore();
  }

  @Cache(1000 * 60 * 60)
  private async fetchLists() {
    let prompts: ListPrompt[] = [];

    for (const list of this.lists) {
      try {
        const res = await fetch(list.url);

        let listPrompts: ListPrompt[] = [];

        if (list.type === 'csv') {
          const csvText = await res.text();
          listPrompts = this.parseCsv(csvText, list);
        }

        prompts = [...prompts, ...listPrompts];
      } catch (error) {
        console.log('fetced error for lists', error);
        continue;
      }
    }

    return prompts;
  }

  private addPrompts(prompts: ListPrompt[]) {
    this.prompts = [...this.prompts, ...prompts];
  }

  private parseCsv(csvText: string, list: PromptListConfig): ListPrompt[] {
    const csvArray = parseCSV(csvText);
    const [csvHeader, ...csvData] = csvArray;

    const titleIdx = csvHeader.indexOf(list.fields.title);
    const promptIdx = csvHeader.indexOf(list.fields.prompt);

    if (titleIdx < 0 || promptIdx < 0) {
      console.warn(`Problem parsing data for ${list.name}`);
      return [];
    }

    return csvData.map((data) => {
      return {
        title: data[titleIdx],
        prompt: data[promptIdx],
        list: list.name,
      };
    });
  }

  private applyFilters(prompts: ListPrompt[]) {
    const favoritePrompts = get(this.favoritePrompts);

    return prompts
      .filter((prompt) =>
        prompt.title.toLowerCase().includes(this.searchText.toLowerCase())
      )
      .sort((a) => (favoritePrompts.includes(a.title) ? -1 : 1));
  }
}

export const promptListService = new PromptListService();
