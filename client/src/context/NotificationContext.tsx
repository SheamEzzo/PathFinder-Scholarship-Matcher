import {createContext, useContext, useState, type ReactNode} from 'react';

export type PathyMood = 'welcome' | 'thinking' | 'success' | 'encourage' | 'goodbye';
export interface PathyMessage { mood: PathyMood; text: string }

const NotificationContext = createContext<{
  message: PathyMessage | null;
  notify: (text: string, mood: PathyMood) => void;
  clear: () => void;
} | null>(null);

export function NotificationProvider({children}: {children: ReactNode}) {
  const [message, setMessage] = useState<PathyMessage | null>(null);

  function notify(text: string, mood: PathyMood) {
    setMessage({text, mood});
  }

  function clear() {
    setMessage(null);
  }

  return <NotificationContext.Provider value={{message, notify, clear}}>
    {children}
  </NotificationContext.Provider>;
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('NotificationProvider is required.');
  return context;
}
