import { DecoratorNaisEnv } from "../../common/common-types";

const devUrlLookupTable: Record<string, string> = {
    "https://www.nav.no": "https://www.intern.dev.nav.no",
    "https://nav.no": "https://www.intern.dev.nav.no",
    "https://www.dev.nav.no": "https://www.intern.dev.nav.no",
};

const dev2UrlLookupTable: Record<string, string> = {
    "https://www.nav.no": "https://www-2.intern.dev.nav.no",
    "https://nav.no": "https://www-2.intern.dev.nav.no",
    "https://www.dev.nav.no": "https://www-2.intern.dev.nav.no",
    "https://www.intern.dev.nav.no": "https://www-2.intern.dev.nav.no",
};

type LookupTable = {
    [env in DecoratorNaisEnv]?: typeof devUrlLookupTable;
};

export const urlLookupTable: LookupTable = {
    dev: devUrlLookupTable,
    beta: dev2UrlLookupTable,
    betaTms: devUrlLookupTable,
};
