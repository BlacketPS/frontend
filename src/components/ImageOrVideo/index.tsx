import styles from "./imageOrVideo.module.scss";

import { ImageOrVideoProps } from "./imageOrVideo.d";

export default function ImageOrVideo({ src, alt, ...props }: ImageOrVideoProps) {
    if (src && ["mp4", "webm"].includes(src.split(".").pop()!)) return (
        <video
            src={src}
            className={`${styles.video}${props.className ? ` ${props.className}` : ""}`}
            autoPlay
            muted={true}
            loop
            {...props}
        />
    );
    else return (
        <img
            src={src}
            alt={alt}
            {...props}
        />
    );
}