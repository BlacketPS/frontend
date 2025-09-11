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

    useEffect(() => {
        if (!video) return;

        const flash = flashRef.current;
        const vid = videoRef.current;
        if (!flash || !vid) return;

        stopAllSounds();
        playSound("bass-drop");

        setTimeout(() => {
            flash.style.backgroundColor = "black";

            setTimeout(() => {
                vid.style.opacity = "1";
                vid.play();
            }, 4000);
        }, 150);
    }, [video]);

    if (video) return (<>
        <style>{"body{overflow:hidden}"}</style>

        <div className={styles.flash} ref={flashRef} />

        <video
            ref={videoRef}
            src={video}
            className={styles.video}
            autoPlay={false}
            muted={false}
            playsInline
            onEnded={() => {
                flashRef.current!.style.opacity = "0";
                videoRef.current!.style.opacity = "0";

                setTimeout(() => {
                    navigate("/chat");
                    setVideo(null);
                }, 5000);
            }}
        />
    </>);
}
