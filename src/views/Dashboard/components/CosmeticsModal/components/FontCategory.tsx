import { useState } from "react";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { SearchBox } from "@components/index";
import { Font } from ".";
import { useChangeFont } from "@controllers/cosmetics/useChangeFont/index";
import styles from "../cosmeticsModal.module.scss";

export default function FontCategory() {
    const [search, setSearch] = useState<string>("");

    const { setLoading } = useLoading();
    const { user } = useUser();
    const { fonts } = useData();

    const { changeFont } = useChangeFont();

    if (!user) return null;


    const onSelect = (id: number) => {
        setLoading(true);

        changeFont({ fontId: id })
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    return (
        <>
            <SearchBox
                placeholder="Search for a font..."
                onChange={(e) => setSearch(e.target.value)}
                containerProps={{
                    style: { padding: "unset", margin: "unset", width: "100%", marginBottom: "10px", boxShadow: "unset" }
                }}
            />

            <div className={styles.holder} data-column={true}>
                {fonts
                    .filter((font) => font.name.toLowerCase().includes(search.toLowerCase()))
                    .filter((font) => font.default)
                    .map((font) => <Font key={font.id} font={font} onClick={() => onSelect(font.id)} />)
                }

                {fonts
                    .filter((font) => font.name.toLowerCase().includes(search.toLowerCase()))
                    .filter((font) => !font.default)
                    .map((font) => (user.fonts as number[]).includes(font.id) && <Font key={font.id} font={font} onClick={() => onSelect(font.id)} />)
                }
            </div>
        </>
    );
}
