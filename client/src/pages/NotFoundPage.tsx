import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import PathyGuidance from "../components/PathyGuidance";
function NotFoundPage() {
  return (
    <>
      <PathyGuidance
        mood="encourage"
        text="A little detour! The catalogue is a good place to start again."
      />
      <EmptyState title="This path doesn’t lead anywhere.">
        <p>The page you’re looking for doesn’t exist.</p>
        <Link to="/scholarships" className="button primary">
          Back to scholarships
        </Link>
      </EmptyState>
    </>
  );
}
export default NotFoundPage;