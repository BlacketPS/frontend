import { useEffect } from "react";

const getDomainName = (hostname: string) => {
    return hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);
};

export default function SettingsAdminHandover() {
    const hostname = getDomainName(window.location.hostname);

    useEffect(() => {
        window.location.href = `https://admin.${hostname}?token=${localStorage.getItem("token")}`;
    }, []);

    return null;
}
