interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}
function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="alert error" role="alert">
      <span>{message}</span>
      <button className="text-button" onClick={() => onRetry()}>
        Try again
      </button>
    </div>
  );
}
export default ErrorMessage;
