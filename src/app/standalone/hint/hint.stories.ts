import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HintComponent } from '@app/standalone/hint/hint.component';
import { HintType } from '@app/core/models/hint-type.enum';
import { TranslocoModule } from '@ngneat/transloco';

export default {
  component: HintComponent,
  title: 'Hint',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule, HintComponent],
    }),
  ],
} as Meta;

type Story = StoryObj<HintComponent>;

export const Hint: Story = {
  args: {
    text: 'This is an info hint.',
    type: HintType.INFO,
  },
};

export const Hint1: Story = {
  args: {
    text: 'This is a warning hint.',
    type: HintType.WARNING,
  },
};
