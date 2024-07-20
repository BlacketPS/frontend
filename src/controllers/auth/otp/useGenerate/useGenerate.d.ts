import { AuthOtpEntity } from "blacket-types";

export interface GenerateResponse extends Fetch2Response {
    data: AuthOtpEntity;
}
