import type { Meta, StoryObj } from "@storybook/react";
import GemCard from "./GemCard";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "ChaseGem/GemCard",
  component: GemCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof GemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Revealed: Story = {
  args: {
    index: 1,
    isRevealed: true,
    name: "CryptoNikyous",
    bio: "Daily sharing of new projects",
    avatarUrl:
      "https://pbs.twimg.com/profile_images/1624724399386423297/rJoU601t_400x400.jpg",
    link: "https://twitter.com/CryptoNikyous",
    supportValue: 0,
  },
};

export const Unrevealed: Story = {
  args: {
    index: 1,
    isRevealed: false,
  },
};
