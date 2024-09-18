import { AuthAuthEntity } from "@blacket/types";

export interface PasswordResponse extends Fetch2Response {
    data: AuthAuthEntity;
}
