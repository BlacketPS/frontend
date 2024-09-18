import { AuthAuthEntity } from "@blacket/types";

export interface LoginResponse extends Fetch2Response {
    data: AuthAuthEntity;
}
