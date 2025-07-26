import { Link } from "react-router-dom";
import styles from "../home.module.scss";

import { FooterSection } from "../home.d";

const SECTIONS: FooterSection[] = [
    {
        title: "Legal",
        links: [
            { to: "/privacy", label: "Privacy Policy" },
            { to: "/terms", label: "Terms of Service" },
            { to: "/eula", label: "End User License Agreement" }
        ]
    },
    {
        title: "Connect",
        links: [
            { href: "/discord", label: "Discord", external: true }
        ]
    },
    {
        title: "Contact",
        links: [
            { href: "mailto:contact-us@blacket.org", label: "contact-us@blacket.org" }
        ]
    },
    {
        title: "Other",
        links: [
            { to: "/rules", label: "Rules"}
        ]
    }
];

export default function Footer() {
    return (
        <div className={styles.footerWrapper}>
            <div className={styles.footerContent}>
                {SECTIONS.map((section, index) => (
                    <div key={index} className={styles.footerMenuList}>
                        <div className={styles.footerMenuTitle}>{section.title}</div>
                        <ul>
                            {section.links.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                    {link.to ? (
                                        <Link to={link.to}>{link.label}</Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            target={link.external ? "_blank" : undefined}
                                            rel={link.external ? "noopener noreferrer" : undefined}
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className={styles.copyrightText}>
                <b>We are not affiliated with Blooket in any way. Do not contact Blooket about any issues you may have with Blacket.</b>
                <br />
                <br />
                Blacket © 2025 All Rights Reserved.
            </div>
        </div>
    );
}
