import type { AllPromptArgs, PromptArgItem, PromptConfig } from './prompt.types';

export class PromptManager {
  args: AllPromptArgs;

  constructor(private config: PromptConfig) {
    this.args = PromptManager.createEmptyArgs(config);
  }

  static createEmptyArgs(config: PromptConfig): AllPromptArgs {
    const promptArgs: AllPromptArgs = {
      ...config.args.reduce((rv, arg) => {
        rv[arg.key] = [];

        return rv;
      }, {}),
    };

    if (config.userTags) {
      promptArgs.user = [];
    }

    return promptArgs;
  }

  getArgConfig(argKey: string) {
    return this.config.args.find((argConfig) => argConfig.key === argKey);
  }

  addArg(argKey: string, argItem: PromptArgItem) {
    this.args[argKey].push(argItem);
  }

  clearArgs() {
    this.args = PromptManager.createEmptyArgs(this.config);
  }

  // TODO: Move removeArg to here
}
