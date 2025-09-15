import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSound } from "@stores/SoundStore";
import { useInsanePull } from "@stores/InsanePullStore";
import styles from "../insanePullStore.module.scss";

export default function InsanePullUI() {
    const { video, setVideo } = useInsanePull();
    const { stopAllSounds, playSound } = useSound();

    const flashRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const fullscreen = () => {
        switch (document.documentElement.requestFullscreen) {
            case undefined:
                if ((document.documentElement as any).webkitRequestFullscreen) (document.documentElement as any).webkitRequestFullscreen();
                if ((document.documentElement as any).msRequestFullscreen) (document.documentElement as any).msRequestFullscreen();

                break;
            default:
                document.documentElement.requestFullscreen();
        }
    };

    useEffect(() => {
        if (!video) return;

        const flash = flashRef.current;
        const vid = videoRef.current;
        if (!flash || !vid) return;

        // weird workaround for autoplay issues - xotic
        vid.pause();

        fullscreen();
        stopAllSounds();
        playSound("bass-drop");
        navigate("/chat");

        const handleCanPlayThrough = () => {
            setTimeout(() => {
                flash.style.backgroundColor = "black";

                setTimeout(() => {
                    vid.style.opacity = "1";
                    vid.play();
                }, 4000);
            }, 150);

            vid.removeEventListener("canplaythrough", handleCanPlayThrough);
        };

        vid.addEventListener("canplaythrough", handleCanPlayThrough);
    }, [video]);

    if (video) return (<>
        <style>{"body{overflow:hidden}"}</style>

        <div className={styles.flash} onContextMenu={(e) => e.preventDefault()} ref={flashRef} />

        <video
            ref={videoRef}
            src={video}
            className={styles.video}
            autoPlay={true}
            muted={false}
            playsInline
            onEnded={() => {
                flashRef.current!.style.opacity = "0";
                videoRef.current!.style.opacity = "0";

                setTimeout(() => {
                    document.exitFullscreen();

                    setVideo(null);
                }, 5000);
            }}
            onContextMenu={(e) => e.preventDefault()}
        />
    </>);
    else return null;
}
