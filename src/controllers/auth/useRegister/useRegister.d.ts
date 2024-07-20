import { AuthAuthEntity } from "blacket-types";

export interface RegisterResponse extends Fetch2Response {
    data: AuthAuthEntity;
}
