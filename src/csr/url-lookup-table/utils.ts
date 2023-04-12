import { urlLookupTable } from "./table";
import { DecoratorNaisEnv } from "../../common/common-types";

export const getUrlFromLookupTable = (url: string, env: DecoratorNaisEnv) => {
    if (!url) {
        return;
    }

    const lookupTable = urlLookupTable[env];
    if (!lookupTable) {
        return;
    }

    const match = Object.keys(lookupTable).find((key) => url.startsWith(key));

    return match ? url.replace(match, lookupTable[match]) : url;
};
