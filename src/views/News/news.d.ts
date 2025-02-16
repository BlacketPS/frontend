import { NewsNewsPostEntity } from "@blacket/types";

export interface PostProps extends HTMLAttributes<HTMLDivElement> {
    post: NewsNewsPostEntity;
}
