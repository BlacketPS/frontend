export interface TextfitProps {
    min?: number;
    max?: number;
    mode?: "multi" | "single";
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;
}
