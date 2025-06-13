import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { BrenderCanvas, BrenderCanvasRef } from "@brender/index";
import { useEffect, useRef } from "react";

export default function Experiments() {
    const { user } = useUser();
    if (!user) return <Navigate to="/login" />;

    const brenderCanvasRef = useRef<BrenderCanvasRef>(null);

    // useEffect(() => {
    //     const brender = brenderCanvasRef.current;
    //     if (!brender) return;

    //     const images = [
    //         // window.constructCDNUrl("/content/uncommon.png"),
    //         // window.constructCDNUrl("/content/rare.png"),
    //         // window.constructCDNUrl("/content/epic.png"),
    //         // window.constructCDNUrl("/content/legendary.png"),
    //         window.constructCDNUrl("/content/token.png"),
    //         window.constructCDNUrl("/content/experience.png"),
    //         window.constructCDNUrl("/content/gem.png"),
    //     ];

    //     brender.camera.moveTo(0, 0);

    //     let id = 0;

    //     const createConfettiPiece = async () => {
    //         const image = await brender.urlToImage(images[Math.floor(Math.random() * images.length)]);

    //         // const fallSpeed = 7 + Math.random() * 5;
    //         const fallSpeed = 10;
    //         const rotationSpeed = 0.5 + Math.random() * 1.5;
    //         // const zIndex = Math.floor(Math.random() * 200);
    //         const rotation = Math.random() * Math.PI * 2;

    //         id++;

    //         return brender.createObject({
    //             id: id.toString(),
    //             x: Math.random() * brender.getWidth(),
    //             y: Math.random() * brender.getHeight() - brender.getHeight(),
    //             z: 0,
    //             width: 50,
    //             height: 50,
    //             rotation,
    //             image,
    //             onFrame: (object, deltaTime) => {
    //                 object.y += fallSpeed * deltaTime;
    //                 object.rotation! += rotationSpeed * deltaTime;

    //                 console.log(object.y);

    //                 if (object.y > brender.getHeight()) {
    //                     object.destroy!();
    //                 }
    //             }
    //         });
    //     };

    //     const confetti = setInterval(() => {
    //         createConfettiPiece();
    //     }, 5);

    //     return () => {
    //         clearInterval(confetti);
    //     };
    // }, []);

    return (
        <>
            <BrenderCanvas
                ref={brenderCanvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1
                }}
                debug={true}
            />
        </>
    );
}
