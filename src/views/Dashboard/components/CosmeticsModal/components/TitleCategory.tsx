import { useState } from "react";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { SearchBox } from "@components/index";
import { Title } from ".";
import { useChangeTitle } from "@controllers/cosmetics/useChangeTitle/index";
import styles from "../cosmeticsModal.module.scss";

export default function TitleCategory() {
    const [search, setSearch] = useState<string>("");

    const { setLoading } = useLoading();
    const { user } = useUser();
    const { titles } = useData();

    const { changeTitle } = useChangeTitle();

    if (!user) return null;


    const onSelect = (id: number) => {
        setLoading(true);

        changeTitle({ titleId: id })
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    return (
        <>
            <SearchBox
                placeholder="Search for a title..."
                onChange={(e) => setSearch(e.target.value)}
                containerProps={{
                    style: { padding: "unset", margin: "unset", width: "100%", marginBottom: "10px", boxShadow: "unset" }
                }}
            />

            <div className={styles.holder} data-column={true}>
                <Title title={titles.find((title) => title.id === 1)!} onClick={() => onSelect(1)} />

                {titles
                    .filter((title) => title.name.toLowerCase().includes(search.toLowerCase()))
                    .sort((a, b) => a.priority - b.priority)
                    .map((title) => (user.titles as number[]).includes(title.id) && <Title key={title.id} title={title} onClick={() => onSelect(title.id)} />)
                }
            </div>
        </>
    );
}
