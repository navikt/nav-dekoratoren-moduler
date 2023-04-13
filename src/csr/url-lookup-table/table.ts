import { DecoratorNaisEnv } from "../../common/common-types";

const devUrlLookupTable: Record<string, string> = {
    "https://www.nav.no": "https://www.dev.nav.no",
    "https://nav.no": "https://www.dev.nav.no",
};

type LookupTable = {
    [env in DecoratorNaisEnv]?: typeof devUrlLookupTable;
};

export const urlLookupTable: LookupTable = {
    dev: devUrlLookupTable,
    beta: devUrlLookupTable,
    betaTms: devUrlLookupTable,
};
