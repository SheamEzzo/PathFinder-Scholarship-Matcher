import Icon from "./Icon";
import {
  educationLabels,
  fundingLabels,
  emptyFilters,
  type Filters as FilterValues,
  type Scholarship,
} from "../types";

export const unique = (values: string[]) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b));
export default function Filters({
  value,
  onChange,
  scholarships,
  search,
  onSearch,
}: {
  value: FilterValues;
  onChange: (v: FilterValues) => void;
  scholarships: Scholarship[];
  search: string;
  onSearch: (v: string) => void;
}) {
  const active = Object.values(value).some(Boolean) || Boolean(search);
  const update = (key: keyof FilterValues, next: string) =>
    onChange({ ...value, [key]: next });
  return (
    <section className="filters-panel" aria-label="Filter scholarships">
      <div className="search-row">
        <label className="search-box">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search scholarships or institutions…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search scholarships"
          />
        </label>
        <button
          className="text-button"
          onClick={() => {
            onChange({ ...emptyFilters });
            onSearch("");
          }}
          disabled={!active}
        >
          Reset filters
        </button>
      </div>
      <div className="filters-grid">
        <label>
          Destination
          <select
            aria-label="Destination"
            value={value.country}
            onChange={(e) => update("country", e.target.value)}
          >
            <option value="">All countries</option>
            {unique(scholarships.map((s) => s.country)).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Field of study
          <select
            aria-label="Field of study"
            value={value.fieldOfStudy}
            onChange={(e) => update("fieldOfStudy", e.target.value)}
          >
            <option value="">All study areas</option>
            {unique(scholarships.flatMap((s) => s.eligibleFieldsOfStudy)).map(
              (v) => (
                <option key={v}>{v}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Required qualification
          <select
            aria-label="Required qualification"
            value={value.educationLevel}
            onChange={(e) => update("educationLevel", e.target.value)}
          >
            <option value="">All qualifications</option>
            {Object.entries(educationLabels).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Funding type
          <select
            aria-label="Funding type"
            value={value.fundingLevel}
            onChange={(e) => update("fundingLevel", e.target.value)}
          >
            <option value="">All funding types</option>
            {Object.entries(fundingLabels).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
