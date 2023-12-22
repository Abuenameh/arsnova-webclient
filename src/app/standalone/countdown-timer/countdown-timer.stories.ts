import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { CountdownTimerComponent } from '@app/standalone/countdown-timer/countdown-timer.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { TranslocoRootModule } from '@app/transloco-root.module';
import { NotificationService } from '@app/core/services/util/notification.service';

class MockClass {}

export default {
  component: CountdownTimerComponent,
  title: 'CountdownTimer',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [CountdownTimerComponent],
      providers: [
        {
          provide: NotificationService,
          useClass: MockClass,
        },
      ],
    }),
    applicationConfig({
      providers: [
        importProvidersFrom(TranslocoRootModule),
        importProvidersFrom(HttpClientModule),
      ],
    }),
  ],
} as Meta;

type Story = StoryObj<CountdownTimerComponent>;

const endDate10 = new Date();
endDate10.setSeconds(endDate10.getSeconds() + 10);

const endDate60 = new Date();
endDate60.setSeconds(endDate60.getSeconds() + 60);

const endDate90 = new Date();
endDate90.setSeconds(endDate90.getSeconds() + 90);

export const Timer10: Story = {
  args: {
    endDate: endDate10,
    showIcon: true,
  },
};

export const Timer60: Story = {
  args: {
    endDate: endDate60,
    showIcon: true,
  },
};

export const Timer90: Story = {
  args: {
    endDate: endDate90,
    showIcon: true,
  },
};
