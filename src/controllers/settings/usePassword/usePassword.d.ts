import { AuthEntity } from "blacket-types";

export interface PasswordResponse extends Fetch2Response {
    data: AuthEntity;
}
