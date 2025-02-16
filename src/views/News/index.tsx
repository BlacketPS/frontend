import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { Post } from "./components";
import styles from "./news.module.scss";

import { NewsNewsPostEntity } from "@blacket/types";

export default function News() {
    const [news, setNews] = useState<NewsNewsPostEntity[]>([]);

    const { user } = useUser();

    if (!user) return <Navigate to="/login" />;

    useEffect(() => {
        window.fetch2.get("/api/news")
            .then((res) => setNews(res.data));
    }, []);

    return (
        <>
            {<div className={styles.posts}>
                {news.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                    />
                ))}
            </div>}
        </>
    );
}
