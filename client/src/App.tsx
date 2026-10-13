import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PathyCompanion from "./components/PathyCompanion";
import ToastNotification from "./components/ToastNotification";
import PageNavigation from "./components/PageNavigation";
import { useNotification } from "./context/NotificationContext";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import ProfilePage from "./pages/ProfilePage";
import MatchesPage from "./components/MatchesPage";
import FavoritesPage from "./pages/FavoritesPage";
import DetailsPage from "./pages/DetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
function App() {
  const { guidance } = useNotification();
  function handleSkipToContent(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById("main-content")?.focus();
  }
  return (
    <div className="app-shell">
      <PageNavigation />
      <a
        href="#main-content"
        className="skip-link"
        onClick={handleSkipToContent}
      >        Skip to content
      </a>
      <Navbar />
      <div className="workspace">
        <main id="main-content" tabIndex={-1}>
          <PathyCompanion guidance={guidance} />
          <ToastNotification />
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/scholarships" replace />}
            />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/scholarships/:id" element={<DetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
}
export default App;
