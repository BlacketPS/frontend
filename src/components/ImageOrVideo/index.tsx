import { forwardRef } from "react";
import styles from "./imageOrVideo.module.scss";

import { ImageOrVideoProps } from "./imageOrVideo.d";

const ImageOrVideo = forwardRef<HTMLImageElement | HTMLVideoElement, ImageOrVideoProps>(({ src, alt, ...props }, ref) => {
    if (src && ["mp4", "webm"].includes(src.split(".").pop()!)) return (
        <video
            ref={ref as React.Ref<HTMLVideoElement>}
            src={src}
            className={`${styles.video}${props.className ? ` ${props.className}` : ""}`}
            autoPlay
            muted={true}
            loop
            {...props}
            onError={(e) => {
                (e.target as HTMLImageElement).src = window.constructCDNUrl("/content/icons/error.png");
            }}
        />
    );
    else return (
        <img
            ref={ref as React.Ref<HTMLImageElement>}
            src={src}
            alt={alt}
            {...props}
            onError={(e) => {
                (e.target as HTMLImageElement).src = window.constructCDNUrl("/content/icons/error.png");
            }}
        />
    );
});

export default ImageOrVideo;
