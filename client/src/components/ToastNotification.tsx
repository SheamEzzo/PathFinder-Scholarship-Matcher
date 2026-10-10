import { useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import Icon from "./Icon";
function ToastNotification() {
  const { toast, dismissToast } = useNotification();
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  if (!toast) return null;
  return (
    <div
      className={`toast ${toast.error ? "error" : ""}`}
      role={toast.error ? "alert" : "status"}
    >
      <Icon name={toast.error ? "close" : "check"} size={19} />
      <span>{toast.text}</span>
      <button
        className="icon-button"
        aria-label="Dismiss notification"
        onClick={dismissToast}
      >
        <Icon name="close" size={17} />
      </button>
    </div>
  );
}
export default ToastNotification;