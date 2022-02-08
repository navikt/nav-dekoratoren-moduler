import { urlLookupTable } from "./table";
import { NaisEnv } from "../../common/common-types";

export const getUrlFromLookupTable = (url: string, env: NaisEnv) => {
    let match;
    const lookupTable = urlLookupTable[env];
    if (url && lookupTable) {
        Object.keys(lookupTable).some((key) => {
            if (url.startsWith(key)) {
                match = key;
                return true;
            }
            return false;
        });
    }
    return match ? url.replace(match, lookupTable[match]) : url;
};
