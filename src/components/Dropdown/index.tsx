import Select from "react-select";

import { DropdownProps } from "./dropdown.d";

export default function Dropdown({ search = { enabled: false, placeholder: "Search for an item..." }, options, onChange, children }: DropdownProps) {
    return (
        <Select
            styles={{
                container: (provided) => ({
                    ...provided,
                    width: "100%",
                    margin: "5px 0 20px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none",
                    color: "var(--accent-color)"
                }),
                control: (provided) => ({
                    ...provided,
                    backgroundColor: "var(--primary-color)",
                    borderRadius: "7px",
                    padding: "5px 5px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "75%",
                    textAlign: "left",
                    fontSize: "18px",
                    borderColor: "var(--accent-color)",
                    boxShadow: "none",
                    "&:hover": { borderColor: "var(--accent-color)" }
                }),
                dropdownIndicator: (provided) => ({ ...provided, transform: "scale(1.5)", color: "var(--accent-color)" }),
                indicatorSeparator: (provided) => ({ ...provided, display: "none" }),
                menu: (provided) => ({
                    ...provided,
                    backgroundColor: "var(--background-color)",
                    borderRadius: "7px",
                    width: "300px",
                    "@media screen and (max-width: 650px)": { width: "95%" }
                }),
                option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "var(--accent-color)" : "var(--background-color)",
                    color: state.isSelected ? "var(--background-color)" : "var(--accent-color)",
                    transition: ".2s",
                    borderRadius: "7px",
                    width: "95%",
                    margin: "5px auto",
                    fontSize: "18px",
                    "&:hover": {
                        backgroundColor: "var(--accent-color)",
                        color: "var(--background-color)"
                    }
                }),
                singleValue: (provided) => ({ ...provided, color: "var(--accent-color)", fontSize: "18px" }),
                placeholder: (provided) => ({ ...provided, color: "var(--accent-color)", fontSize: "18px" })
            }}
            classNamePrefix="dropdown"
            options={options}
            isSearchable={search.enabled}
            placeholder={children}
            onChange={(option) => onChange(option?.value)}
        />
    );
}
