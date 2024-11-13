export default function Title({ children }: { children: string }) {
    return (
        <div style={{ fontSize: "50px", fontFamily: "Titan One" }}>
            {import.meta.env.VITE_INFORMATION_NAME.toUpperCase()} {children}
        </div>
    );
}
