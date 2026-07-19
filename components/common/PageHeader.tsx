export function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <header className="page-header">
      <div className="page-header-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display page-title">{title}</h1>
        <p className="lede">{lede}</p>
      </div>
      <div className="page-header-field" aria-hidden="true">
        <span />
      </div>
    </header>
  );
}
