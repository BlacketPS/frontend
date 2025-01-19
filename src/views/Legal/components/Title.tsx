import { TitleProps } from "../legal.d";

export default function Title({ children }: TitleProps) {
    return (
        <div style={{ fontSize: "50px", fontFamily: "Titan One" }}>
            {import.meta.env.VITE_INFORMATION_NAME.toUpperCase()} {children}
        </div>
    );
}
