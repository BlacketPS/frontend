import { CSSProperties, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useLoading } from "@stores/LoadingStore/index";
import { Button, ColorPicker, Username } from "@components/index";
import { useChangeColor } from "@controllers/cosmetics/useChangeColor/index";
import styles from "../cosmeticsModal.module.scss";

import { PermissionTypeEnum } from "@blacket/types";
import { GradientPoint } from "../cosmeticsModal.d";

const disabledStyles: CSSProperties = {
    opacity: 0.5,
    pointerEvents: "none"
};

const hexIsLight = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
};

export default function GradientCategory() {
    const { user } = useUser();
    if (!user) return null;

    const [userColor, setUserColor] = useState<string>(user.color);
    const [color, setColor] = useState<string>("#ffffff");
    const [points, setPoints] = useState<GradientPoint[]>([
        { color: "#000000", position: 0 },
        { color: "#ffffff", position: 1 }
    ]);

    const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
    const [rotation, setRotation] = useState<number>(90);

    const [prevMouseX, setPrevMouseX] = useState<number>(0);
    const [mouseX, setMouseX] = useState<number>(0);

    const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);

    const { closeModal } = useModal();
    const { setLoading } = useLoading();

    const [dragging, setDragging] = useState<boolean>(false);

    const { changeColorTier2 } = useChangeColor();

    const containerRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            setMouseX(e.clientX);
        }

        function handleTouchMove(e: TouchEvent) {
            setMouseX(e.touches[0].clientX);
        }

        function handleMouseUp() {
            setDragging(false);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const gradientPointsToUserColorString = (rotation: number, points: GradientPoint[]) => {
        const sortedPoints = points.slice().sort((a, b) => a.position - b.position);

        return `${rotation}|${sortedPoints.map((point) => `${point.color}@${Math.round(point.position * 100)}`).join(",")}`;
    };

    const userColorStringToGradientPoints = (userColor: string) => {
        if (!user.color.includes("|")) return;

        const [rotation, pointsString] = userColor.split("|");

        setRotation(parseInt(rotation));

        const points = pointsString.split(",").map((pointString) => {
            const [color, positionString] = pointString.split("@");

            return { color, position: parseInt(positionString) / 100 };
        });

        setPoints(points);
    };

    // update gradient when points change
    useEffect(() => {
        if (!dragging || selectedPoint === null) return;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();

        const x = mouseX - rect.left;
        const position = Math.min(1, Math.max(0, x / rect.width));

        const newPoints = [...points];
        newPoints[selectedPoint].position = position;

        setPoints(newPoints);
    }, [mouseX]);

    // update user color when points change
    useEffect(() => {
        setUserColor(gradientPointsToUserColorString(rotation, points));
    }, [points]);

    // initialize the gradient points from user color
    useEffect(() => {
        userColorStringToGradientPoints(user.color);
    }, []);

    return (
        <div className={styles.holder} data-column={true}>
            <div className={styles.colorCategoryHolder}>
                <div>Create a gradient:</div>

                <ColorPicker onPick={(c) => {
                    if (typeof selectedPoint !== "number") return;

                    const newPoints = [...points];
                    newPoints[selectedPoint].color = c;

                    setPoints(newPoints);
                }}
                    open={[colorPickerOpen, setColorPickerOpen]}
                    hideInput={true}
                    initialColor={[color, setColor]}
                    style={{
                        left: `calc(${points[selectedPoint ?? 0].position * 100 + "%"} - 200px)`,
                        marginTop: 170
                    }}
                />

                <div ref={containerRef}
                    className={styles.gradientPicker}
                    style={{
                        background: `linear-gradient(90deg, ${points
                            // javascript sort is inline so we need to clone the array, hence the empty slice here
                            .slice()
                            .sort((a, b) => a.position - b.position)
                            .map((point) => point.color + " " + point.position * 100 + "%").join(", ")
                            })`
                    }}
                    onClick={(e) => {
                        if (points.length > 4) return;

                        const pointsNear = points.filter((point) => Math.abs(point.position - (e.clientX - containerRef.current!.getBoundingClientRect().left) / containerRef.current!.getBoundingClientRect().width) < 0.05);
                        if (pointsNear.length > 0) return;

                        const rect = containerRef.current!.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const position = Math.min(1, Math.max(0, x / rect.width));

                        const newPoints = [...points];
                        newPoints.push({ color: "#000000", position });

                        setPoints(newPoints);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                    }}
                >
                    {points.map((point, index) => (
                        <div
                            key={index}
                            className={styles.gradientPoint}
                            style={{
                                background: point.color,
                                left: point.position * 100 + "%",
                                borderColor: hexIsLight(point.color) ? "#000" : "#fff"
                            }}
                            onClick={() => {
                                if (mouseX !== prevMouseX) return;

                                setColor(point.color);
                                setColorPickerOpen(true);
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();

                                if (points.length < 3) return;

                                const newPoints = [...points];
                                newPoints.splice(points.indexOf(point), 1);

                                setSelectedPoint(null);
                                setPoints(newPoints);
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();

                                setSelectedPoint(points.indexOf(point));

                                setPrevMouseX(e.clientX);
                                setDragging(true);
                            }}
                            onTouchStart={(e) => {
                                e.preventDefault();

                                setSelectedPoint(points.indexOf(point));

                                setPrevMouseX(e.touches[0].clientX);
                                setDragging(true);
                            }}
                        />
                    ))}
                </div>

                <div className={styles.usernameWouldLookLike}>Your username would look like: <Username style={{ marginLeft: 5 }} user={{ ...user, color: userColor }} /></div>

                <Button.GenericButton
                    onClick={() => {
                        setLoading(true);

                        changeColorTier2({ color: userColor })
                            .then(() => closeModal())
                            .finally(() => setLoading(false));
                    }}
                    style={{
                        ...(!user.permissions.includes(PermissionTypeEnum.CHANGE_NAME_COLOR_TIER_1) ? disabledStyles : {}),
                        marginTop: 15
                    }}
                >
                    Save
                </Button.GenericButton>

                {!user.permissions.includes(PermissionTypeEnum.CHANGE_NAME_COLOR_TIER_1) && (
                    <div style={{ marginTop: 10 }}>
                        <div>Your current plan doesn't support changing your color.</div>

                        <Button.GenericButton
                            onClick={() => {
                                closeModal();

                                navigate("/store");
                            }}
                            style={{ marginTop: 15 }}
                        >
                            Upgrade Plan
                        </Button.GenericButton>
                    </div>
                )}
            </div>
        </div >
    );
}
