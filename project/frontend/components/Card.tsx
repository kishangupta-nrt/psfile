export default function Card({
  title,
  value,
  sub,
}: {
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {sub ? <div className="muted">{sub}</div> : null}
    </div>
  );
}
