import { MarketOpenPackEntity } from "blacket-types";

export interface OpenPackResponse extends Fetch2Response {
    data: MarketOpenPackEntity;
}
