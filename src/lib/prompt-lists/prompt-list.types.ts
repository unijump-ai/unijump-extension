export interface PromptListConfig {
  name: string;
  url: string;
  type: 'csv' | 'json';
  fields: {
    title: string;
    prompt: string;
  };
}
