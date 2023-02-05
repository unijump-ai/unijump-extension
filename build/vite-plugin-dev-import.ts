import { Plugin } from 'vite';
import { readFileSync } from 'fs';

interface PluginDevImportOptions {
  match: RegExp;
  replace: [string, string];
  required?: boolean;
}

export function pluginDevImport(options: PluginDevImportOptions): Plugin {
  const { match, replace, required } = options;

  if (!match || replace.length !== 2) {
    throw new Error('Missing `match` and/or `replace` fields!');
  }

  return {
    name: 'vite-plugin-dev-import',
    load(id) {
      if (!id.match(match)) {
        return;
      }

      const devFilePath = id.replace(...replace);

      try {
        return readFileSync(devFilePath, 'utf-8');
      } catch (error) {
        if (required) {
          throw new Error(
            `Dev file file not found for ${id} Please create index.dev.ts file for development!`
          );
        }
      }
    },
  };
}
