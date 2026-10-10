import { createContext, useContext, useState, type ReactNode } from "react";
export type PathyMood =
  "welcome" | "thinking" | "success" | "encourage" | "goodbye";
export interface PathyMessage {
  mood: PathyMood;
  text: string;
}
interface ToastMessage {
  text: string;
  error: boolean;
}
interface NotificationContextValue {
  message: PathyMessage | null;
  guidance: PathyMessage;
  toast: ToastMessage | null;
  notify: (text: string, mood: PathyMood) => void;
  clear: () => void;
  setGuidance: (guidance: PathyMessage) => void;
  showToast: (text: string, error?: boolean) => void;
  dismissToast: () => void;
}
const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);
function NotificationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<PathyMessage | null>(null);
  const [guidance, setGuidance] = useState<PathyMessage>({
    mood: "welcome",
    text: "Hi, I’m Pathy! Let’s find a scholarship that feels right for you.",
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  function notify(text: string, mood: PathyMood) {
    setMessage({ text, mood }); }
  function clear() {
    setMessage(null);
  }
  function showToast(text: string, error = false) {
    setToast({ text, error });
  }
  function dismissToast() {
    setToast(null);
  }
  return (
    <NotificationContext.Provider
      value={{
        message,
        guidance,
        toast,
        notify,
        clear,
        setGuidance,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("NotificationProvider is required.");
  return context;
}
export { NotificationProvider, useNotification };