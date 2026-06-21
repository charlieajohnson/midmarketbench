import { siAlibabacloud, siAnthropic, siBytedance, siDeepseek, siGooglegemini, siX } from "simple-icons";
import type { Provider } from "@/lib/types";

const icons = {
  anthropic: siAnthropic,
  google: siGooglegemini,
  xai: siX,
  alibaba: siAlibabacloud,
  bytedance: siBytedance,
  deepseek: siDeepseek,
} as const;

export function ModelLogo({ provider, size = 28 }: { provider: Provider; size?: number }) {
  const icon = icons[provider.slug as keyof typeof icons];
  return (
    <span
      className="provider-logo"
      style={{ width: size, height: size }}
      aria-label={`${provider.name} logo`}
      role="img"
    >
      {icon ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={icon.path} />
        </svg>
      ) : (
        <span className="mono" style={{ fontSize: size > 30 ? 12 : 9, fontWeight: 700 }}>
          {provider.name === "OpenAI" ? "OAI" : provider.name.slice(0, 1)}
        </span>
      )}
    </span>
  );
}
