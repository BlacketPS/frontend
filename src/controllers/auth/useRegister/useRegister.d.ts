import { AuthEntity } from "blacket-types";

export interface RegisterResponse extends Fetch2Response {
    data: AuthEntity;
}
