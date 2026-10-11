function MultiSelect({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}) {
  function handleToggle(option: string) {
    if (value.includes(option))
      onChange(value.filter((item) => item !== option));
    else onChange([...value, option]);
  }
  return (
    <fieldset className="choice-field">
      <legend>
        {label} <span className="required">*</span>
      </legend>
      {hint && <p className="field-hint">{hint}</p>}
      <div className="choices">
        {options.map((option) => (
          <label
            className={`choice ${value.includes(option) ? "selected" : ""}`}
            key={option}
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => handleToggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default MultiSelect;
