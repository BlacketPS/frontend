import { Button } from "@components/index";
import { StatButtonProps } from "../dashboard.d";

export default function StatButton({ icon, backgroundColor = "var(--primary-color)", onClick, children, ...props }: StatButtonProps) {
    return (
        <Button.GenericButton style={{ fontSize: "2vh" }} icon={icon} backgroundColor={backgroundColor} useVhStyles={true} onClick={onClick}>
            {children}
        </Button.GenericButton>
    );
}
