import { SectionProps } from "../legal.d";

export default function Section({ title, children }: SectionProps) {
    const content = children
        .replace(/{name}/gi, import.meta.env.VITE_INFORMATION_NAME)
        .split("\n");

    return (
        <>
            <div style={{ fontSize: "25px", marginBottom: "-15px", fontWeight: 700 }}>{title}</div>
            <br />
            <div>{content.map((line, index) => <div key={index}>{line}</div>)}</div>
            <br />
        </>
    );
}
