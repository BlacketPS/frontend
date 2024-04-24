export interface RegisterResponse extends Fetch2Response {
    data: {
        token: string;
    };
}
