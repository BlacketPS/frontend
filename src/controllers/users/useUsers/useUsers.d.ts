import { PublicUser } from "blacket-types";

export interface GetUserResponse extends Fetch2Response {
    data: PublicUser;
}
