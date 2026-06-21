import type { AnswerKeyItem } from "@/lib/types";

export function TrapDisclosure({ items }: { items: AnswerKeyItem[] }) {
  return (
    <details className="answer-key">
      <summary>Reveal scoring spoilers and embedded traps</summary>
      <div className="answer-key-content">
        {items.map((item) => (
          <article className="answer-item" key={item.id}>
            <span className="mono fine">{item.id}</span>
            <h4>{item.issue}</h4>
            <p>{item.whyItMatters}</p>
            <ul>
              {item.evidence.map((evidence) => (
                <li className="muted" key={evidence}>
                  {evidence}
                </li>
              ))}
            </ul>
            <p className="fine">
              <strong>High-score behaviour:</strong> {item.highScoreResponse}
            </p>
          </article>
        ))}
      </div>
    </details>
  );
}
