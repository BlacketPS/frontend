import { AuthEntity } from "blacket-types";

export interface LoginResponse extends Fetch2Response {
    data: AuthEntity;
}
