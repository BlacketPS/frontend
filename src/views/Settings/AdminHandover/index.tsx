import { useEffect } from "react";

const getDomainName = (hostname: string) => {
    return hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);
};

export default function SettingsAdminHandover() {
    const hostname = getDomainName(window.location.hostname);

    useEffect(() => {
        if (import.meta.env.MODE === "development") window.location.href = `https://admin-dev.${hostname}?token=${localStorage.getItem("token")}`;
        else window.location.href = `https://admin.${hostname}?token=${localStorage.getItem("token")}`;
    }, []);

    return null;
}
