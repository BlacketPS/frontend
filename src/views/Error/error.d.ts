export enum ErrorCode {
    UNKNOWN = 0,
    NOT_FOUND = 404,
    BLACKLISTED = 403,
    MAINTENANCE = 502
}

export interface ErrorProps {
    code: ErrorCode
    reason?: string
}

export interface ImageProps {
    src: string
    alt: string
}
