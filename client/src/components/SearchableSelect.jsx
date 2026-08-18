import Select from "react-select";

export default function SearchableSelect({ options, value, onChange, placeholder }) {
  const selected = options.find((item) => item.value === value) || null;

  return (
    <Select
      classNamePrefix="oselect"
      options={options}
      value={selected}
      onChange={(item) => onChange(item?.value || "")}
      placeholder={placeholder || "Select..."}
      isSearchable
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 })
      }}
    />
  );
}
