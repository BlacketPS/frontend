export interface SectionProps {
    title: string;
    children: string;
}

export interface UpdatedAtProps {
    date: string;
}

export interface LegalObject {
    updatedAt: string;
    sections: {
        title: string;
        content: string;
    }[];
}
