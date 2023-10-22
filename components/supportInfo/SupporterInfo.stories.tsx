import type { Meta, StoryObj } from "@storybook/react";
import SupporterInfo from "./SupporterInfo";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "ChaseGem/SupporterInfo",
  component: SupporterInfo,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof SupporterInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Support1: Story = {
  args: {
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    amount: "0.00077777777777",
    displayName: "kflcsd.lens",
    description: "",
    platform: "lens",
    links: {
      lenster: {
        link: "https://lenster.xyz/u/kflcsd",
        handle: "kflcsd",
      },
    },
  },
};
