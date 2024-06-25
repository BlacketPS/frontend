import { PrivateUser } from "blacket-types";

export interface GetUserResponse extends Fetch2Response {
    data: PrivateUser;
}
