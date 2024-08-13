import { useEffect, useRef, useState } from "react";
import { Input } from "@components/index";
import styles from "./dropdown.module.scss";

import { DropdownProps } from "./dropdown.d";

export default function Dropdown({ options, onPick, children }: DropdownProps) {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const dropdownButtonRef = useRef<HTMLDivElement>(null);
    const dropdownMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownMenuRef.current
                && !dropdownMenuRef.current.contains(event.target as Node)
                && !dropdownButtonRef.current?.contains(event.target as Node)
            ) setDropdownOpen(false);
        }

        if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <>
            <div className={styles.dropdownContainer}>
                <div ref={dropdownButtonRef} className={styles.dropdownButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {children ?? "Selected Item:"}
                </div>
            </div>

            {dropdownOpen && <div className={styles.dropdownMenuContainer} style={{ transform: `translateY(${window.innerWidth < 650 ? "-310px" : "-10px"})` }}>
                <div ref={dropdownMenuRef} className={styles.dropdownMenu}>
                    {window.innerWidth > 650 && <Input
                        placeholder="Search for an item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        containerProps={{
                            style: {
                                width: "98%",
                                maxWidth: "unset",
                                margin: "unset",
                                borderRadius: "unset",
                                border: "none"
                            }
                        }}
                    />}

                    <div className={styles.itemList}>
                        {options.filter((option) => option.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? options.filter((option) => option.name.toLowerCase().includes(searchQuery.toLowerCase())).map((option, i) => (
                            <div key={i} className={styles.itemListItem} onClick={() => {
                                if (option.onClick) option.onClick();
                                onPick(option.value);

                                setDropdownOpen(false);
                            }}>
                                {option.name}
                            </div>
                        )) : <div className={styles.noItems}>No items found.</div>}
                    </div>

                    {window.innerWidth <= 650 && <Input
                        placeholder="Search for an item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        containerProps={{
                            style: {
                                width: "98%",
                                maxWidth: "unset",
                                margin: "unset",
                                borderRadius: "unset",
                                border: "none"
                            }
                        }}
                    />}
                </div>
            </div>}
        </>
    );
}
