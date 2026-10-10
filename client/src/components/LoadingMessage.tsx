function LoadingMessage({
  label = "Loading scholarships and your latest profile.",
}: {
  label?: string;
}) {
  return (
    <div className="initial-loading" role="status">
      <span className="loader" />
      <h2>Finding your possibilities…</h2>
      <p>{label}</p>
    </div>
  );
}
export default LoadingMessage;