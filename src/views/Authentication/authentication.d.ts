export enum AuthenticationType {
    LOGIN = 1,
    REGISTER = 2
}

export interface AuthenticationProps {
    type: AuthenticationType;
}
