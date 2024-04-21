import styles from "../home.module.scss";

export default function Copyright() {
    const name = import.meta.env.VITE_INFORMATION_NAME;

    return (
        <div className={styles.copyrightInformation}>
            We are not affiliated with Blooket in any way.
            <br />
            Please do not contact Blooket about any issues you may have with {name}.
            <br />
            {name} © {new Date().getFullYear()} All Rights Reserved.
        </div>
    );
}
