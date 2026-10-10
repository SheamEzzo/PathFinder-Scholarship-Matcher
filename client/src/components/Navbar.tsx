import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchFavorites } from "../api";
import { useNotification } from "../context/NotificationContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectSavedCount,
  setSavedIds,
} from "../store/savedScholarshipsSlice";
import Icon from "./Icon";
const links = [
  { id: "scholarships", label: "Discover scholarships" },
  { id: "profile", label: "My profile" },
  { id: "matches", label: "My matches" },
  { id: "favorites", label: "Saved scholarships" },
];
function Navbar() {
  const { pathname } = useLocation();
  const screen = pathname.startsWith("/scholarships/")
    ? "detail"
    : pathname.slice(1);
  const savedCount = useAppSelector(selectSavedCount);
  const dispatch = useAppDispatch();
  const { clear } = useNotification();
  useEffect(() => {
    const controller = new AbortController();
    async function loadSavedCount() {
      try {
        const data = await fetchFavorites(controller.signal);
        if (!controller.signal.aborted)
          dispatch(          setSavedIds(data.items.map((scholarship) => scholarship.id)),
          );
      } catch {
        /* The active section offers retry for load errors. */
      }
    }
    loadSavedCount();
    return () => controller.abort();
  }, [pathname]);
  const [open, setOpen] = useState(false);
  function navigate() {
    setOpen(false);
    clear();
  }
  return (
    <header className="navbar">
      <Link
        className="navbar-brand"
        to="/scholarships"
        onClick={navigate}
        aria-label="Pathy home"
      >
        <span className="navbar-logo">
          <img src="/pathy.jpeg" alt="" />
        </span>
        <span>
          Pathy<span className="brand-dot">.</span>
        </span>
      </Link>
      <span className="navbar-tagline">
        A little guidance. A world of possibility.
      </span> <button
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      <nav
        id="main-nav"
        className={`navbar-links ${open ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {links.map((link) => (
          <Link
            key={link.id}
            to={`/${link.id}`}
            onClick={navigate}
            className={`nav-link ${screen === link.id || (screen === "detail" && link.id === "scholarships") ? "nav-link-active" : ""}`}
            aria-current={screen === link.id ? "page" : undefined}
          >
            {link.label}
            {link.id === "favorites" && (
              <span className="saved-count-badge">{savedCount}</span>
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
export default Navbar;