import { UpdatedAtProps } from "../legal.d";

export default function UpdatedAt({ date }: UpdatedAtProps) {
    return (
        <div style={{ fontSize: "30px", marginTop: 5 }}>
            Last Updated at: {date}
        </div>
    );
}
