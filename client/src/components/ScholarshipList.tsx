import type { Scholarship } from "../types";
import ScholarshipCard from "./ScholarshipCard";

interface ScholarshipListProps {
  scholarships: Scholarship[];
  loading: boolean;
  busy: boolean;
  onSave: (scholarship: Scholarship) => void;
}
function ScholarshipList({
  scholarships,
  loading,
  busy,
  onSave,
}: ScholarshipListProps) {
  return (
    <div className={loading ? "results refreshing" : "results"}>
      <div className="scholarship-grid">
        {scholarships.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            onSave={onSave}
            busy={busy}
          />
        ))}
      </div>
    </div>
  );
}
export default ScholarshipList;
