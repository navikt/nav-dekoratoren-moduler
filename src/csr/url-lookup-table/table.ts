import { DecoratorNaisEnv } from "../../common/common-types";

const devUrlLookupTable = {
    "https://www.nav.no": "https://www.dev.nav.no",
    "https://nav.no": "https://www.dev.nav.no",
};

type LookupTable = {
    [env in Exclude<DecoratorNaisEnv, "prod">]: typeof devUrlLookupTable;
};

export const urlLookupTable: LookupTable = {
    dev: devUrlLookupTable,
    beta: devUrlLookupTable,
    betaTms: devUrlLookupTable,
};
