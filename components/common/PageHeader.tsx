export function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <header>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display page-title">{title}</h1>
      <p className="lede">{lede}</p>
    </header>
  );
}
