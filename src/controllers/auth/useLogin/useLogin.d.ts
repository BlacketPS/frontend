export interface LoginResponse extends Fetch2Response {
    data: {
        token: string;
        codeRequired?: boolean;
    };
}
