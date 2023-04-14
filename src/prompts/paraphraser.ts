import { PromptArgType, type PromptConfig } from '../lib/prompt/prompt.types';

type ParaphraserArgs = 'modes' | 'tones';

export default {
  name: 'Paraphraser',
  userTags: true,
  ctaLabel: 'Paraphrase',
  addUserTagLabel: 'Add Your Own Tone',
  outputType: 'text',
  initialPrompt: (input: string) =>
    `You're a paraphraser. Do not respond with anything except paraphrased text. ${input}`,
  input: (args, userInput) => {
    const { modes, tones, user } = args;

    const formattedArgs = [...modes, ...tones, ...user]
      .map((tag) => `more ${tag.value}`)
      .join(', ');

    return `Paraphrase following text ${formattedArgs}:\n ${userInput}`;
  },
  args: [
    {
      key: 'modes',
      title: 'Writing modes',
      type: PromptArgType.MULTI_SELECT,
      list: [
        {
          label: '👔 Formal',
          value: 'formal',
        },
        {
          label: '🐬 Fluent',
          value: 'fluent',
        },
        {
          label: '🧐 Serious',
          value: 'serious',
        },
        {
          label: '🥸 Professional',
          value: 'professional',
        },
        {
          label: '⚡ Motivating',
          value: 'motivating',
        },
        {
          label: '🙏 Respectful',
          value: 'respectful',
        },
        {
          label: '💪 Assertive',
          value: 'assertive',
        },
        {
          label: '😍 Captivating',
          value: 'captivating',
        },
        {
          label: '🚨 Urgent',
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
          label: '😐 Neutral',
          value: 'neutral',
        },
        {
          label: '😌 Confident',
          value: 'confident',
        },
        {
          label: '👉 Direct',
          value: 'direct',
        },
        {
          label: '🥰 Friendly',
          value: 'friendly',
        },
        {
          label: '😊 Smiley',
          value: 'smiley',
        },
        {
          label: '🙂 Polite',
          value: 'polite',
        },
        {
          label: '👍 Helpful',
          value: 'helpful',
        },
        {
          label: '😡 Angry',
          value: 'angry',
        },
        {
          label: '😂 Funny',
          value: 'funny',
        },
      ],
    },
  ],
} satisfies PromptConfig<ParaphraserArgs>;
