import type { Provider } from "@/lib/types";

export const providers: Provider[] = [
  { id: "openai", name: "OpenAI", slug: "openai", website: "https://openai.com" },
  { id: "anthropic", name: "Anthropic", slug: "anthropic", website: "https://anthropic.com" },
  { id: "google", name: "Google", slug: "google", website: "https://deepmind.google" },
  { id: "xai", name: "xAI", slug: "xai", website: "https://x.ai" },
  { id: "zai", name: "Z.ai", slug: "zai", website: "https://z.ai" },
  { id: "bytedance", name: "ByteDance", slug: "bytedance", website: "https://seed.bytedance.com" },
  { id: "alibaba", name: "Alibaba", slug: "alibaba", website: "https://qwen.ai" },
  { id: "deepseek", name: "DeepSeek", slug: "deepseek", website: "https://deepseek.com" },
];
