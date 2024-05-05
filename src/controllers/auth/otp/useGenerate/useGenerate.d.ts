import { OtpAuthEntity } from "blacket-types";

export interface GenerateResponse extends Fetch2Response {
    data: OtpAuthEntity;
}
