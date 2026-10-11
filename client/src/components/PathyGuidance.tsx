import { useEffect } from "react";
import {
  useNotification,
  type PathyMessage,
} from "../context/NotificationContext";
interface PathyGuidanceProps extends PathyMessage {
  loading?: boolean;
  error?: string;
}
function PathyGuidance({ mood, text, loading, error }: PathyGuidanceProps) {
  const { setGuidance } = useNotification();
  useEffect(() => {
    if (error)
      setGuidance({
        mood: "encourage",
        text: "We couldn’t reach the server. Try again when your connection is ready.",
      });
    else if (loading)
      setGuidance({
        mood: "thinking",
        text: "One moment! I’m checking your latest scholarships and profile.",
      });
    else setGuidance({ mood, text });
  }, [mood, text, loading, error]);
  return null;
}
export default PathyGuidance;