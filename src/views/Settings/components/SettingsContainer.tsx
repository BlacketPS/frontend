import styles from "../settings.module.scss";

import { SettingsContainerProps } from "../settings.d";
import { Container } from "@components/index";

export default function SettingsContainer({ header, children }: SettingsContainerProps) {
    return (
        <Container.LabeledContainer label={header.text} icon={header.icon}>
            {children}
        </Container.LabeledContainer>
    );
}
