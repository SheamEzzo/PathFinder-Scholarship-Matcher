import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
function PageNavigation() {
  const { pathname } = useLocation();
  const { clear, dismissToast } = useNotification();
  useEffect(() => {
    let title = "Page not found";
    if (pathname === "/scholarships") title = "Discover scholarships";
    if (pathname === "/profile") title = "My profile";
    if (pathname === "/matches") title = "My matches";
    if (pathname === "/favorites") title = "Saved scholarships";
    if (pathname.startsWith("/scholarships/"))
      title = "Scholarship details";
    document.title = `${title} · Pathy`;
    clear();
    dismissToast();
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}
export default PageNavigation;