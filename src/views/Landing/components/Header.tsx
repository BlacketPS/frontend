import stylesLanding from "../landing.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@components/index";

export function Header() {
    const navigate = useNavigate();

    return <header className={stylesLanding.headerContainer}>
        <Link to="/" className={stylesLanding.headerTitle}>
            {import.meta.env.VITE_INFORMATION_NAME}
            <span className={stylesLanding.headerTitleSub}>{import.meta.env.VITE_INFORMATION_VERSION}</span>
        </Link>

        <div className={stylesLanding.headerLinks}>
            <Link to="https://discord.gg/blacket" target={"_blank"}>
                Discord
            </Link>
            <Link to="/store">
                Store
            </Link>
            <Button.GenericButton style={{ transform: "translateY(2px)" }} onClick={() => navigate("/login")}>
                Play
            </Button.GenericButton>
        </div>
    </header>;
}
