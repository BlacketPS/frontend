export interface Rule {
    name: string;
    content: string;
}

export interface RuleObject {
    updatedAt: string;
    header: string;
    rules: Rule[];
    footer: string;
}

export interface TooFastModalProps {
    startedReading: Date;
}
