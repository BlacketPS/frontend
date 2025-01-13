import { useResource } from "@stores/ResourceStore/index";
import { useUser } from "@stores/UserStore/index";
import { Username, Markdown } from "@components/index";
import styles from "../news.module.scss";

import { PostProps } from "../news.d";

export default function Post({ post }: PostProps) {
    const { resourceIdToPath } = useResource();
    const { user } = useUser();

    if (!user) return null;

    return (
        <div className={styles.postContainer}>
            <div className={styles.postTopContainer}>
                <img
                    className={styles.postImage}
                    draggable={false}
                    src={resourceIdToPath(post.imageId)}
                />
                <div className={styles.postDate}>
                    <i className="fas fa-calendar-alt" />
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className={styles.postAuthor}>
                    <Username user={post.author} />
                    <i className="fas fa-user" />
                </div>
            </div>
            <div className={styles.postTitle}>
                {post.title}
            </div>
            <div className={styles.postDivider} />

            <div className={styles.postBottomContainer}>
                <div className={styles.postContent}>
                    <Markdown user={user}>
                        {post.content}
                    </Markdown>
                </div>

                <div className={styles.postScoringContainer}>
                    <div className={styles.postScoreUpvote}>
                        <i className="fas fa-arrow-up" />
                        {post.votes.upvotes.toLocaleString()}
                    </div>

                    <div className={styles.postScoreDownvote}>
                        <i className="fas fa-arrow-down" />
                        {post.votes.downvotes.toLocaleString()}
                    </div>
                </div>

                <div className={styles.postReadMoreText}>
                    Read more...
                </div>
            </div>
        </div>
    );
}
