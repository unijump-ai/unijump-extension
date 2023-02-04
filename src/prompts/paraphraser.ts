import { PromptArgType, type PromptConfig } from '../lib/prompt/prompt.types';

type ParaphraserArgs = 'modes' | 'tones';

export default {
  name: 'Paraphraser',
  initialPrompt: (input: string) => `Paraphrase following text ${input}`,
  input: (args, userInput) => {
    const { modes, tones, user } = args;

    const formattedArgs = [...modes, ...tones, ...user]
      .map((tag) => `more ${tag}`)
      .join(',');

    return `${formattedArgs}:\n ${userInput}`;
  },
  args: [
    {
      key: 'modes',
      title: 'Writing modes',
      type: PromptArgType.MULTI_SELECT,
      list: [
        {
          title: '👔 Formal',
          value: 'formal',
        },
        {
          title: '🐬 Fluent',
          value: 'fluent',
        },
        {
          title: '🧐 Serious',
          value: 'serious',
        },
        {
          title: '🥸 Professional',
          value: 'professional',
        },
        {
          title: '⚡ Motivating',
          value: 'motivating',
        },
        {
          title: '🙏 Respectful',
          value: 'respectful',
        },
        {
          title: '💪 Assertive',
          value: 'assertive',
        },
        {
          title: '😍 Captivating',
          value: 'captivating',
        },
        {
          title: '🚨 Urgent',
          value: 'urgent',
        },
      ],
    },
    {
      key: 'tones',
      title: 'Tone of voice',
      type: PromptArgType.MULTI_SELECT,
      list: [
        {
          title: '😐 Neutral',
          value: 'neutral',
        },
        {
          title: '😌 Confident',
          value: 'confident',
        },
        {
          title: '👉 Direct',
          value: 'direct',
        },
        {
          title: '🥰 Friendly',
          value: 'friendly',
        },
        {
          title: '😊 Smiley',
          value: 'smiley',
        },
        {
          title: '🙂 Polite',
          value: 'polite',
        },
        {
          title: '👍 Helpful',
          value: 'helpful',
        },
        {
          title: '😡 Angry',
          value: 'angry',
        },
        {
          title: '😂 Funny',
          value: 'funny',
        },
      ],
    },
  ],
} satisfies PromptConfig<ParaphraserArgs>;
