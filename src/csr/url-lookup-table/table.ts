import { NaisEnv } from "../../common/common-types";

const devUrlLookupTable = {
    "https://arbeidsgiver.nav.no": "https://arbeidsgiver-q.nav.no",
    "https://arbeidsplassen.nav.no": "https://arbeidsplassen-q.nav.no",
    "https://arbeidssokerregistrering.nav.no": `https://arbeidssokerregistrering-q.nav.no`,
    "https://familie.nav.no": "https://familie.dev.nav.no",
    "https://foreldrepenger.nav.no": "https://foreldrepenger.dev.nav.no",
    "https://mininnboks.nav.no": "https://mininnboks.dev.nav.no",
    "https://tjenester.nav.no": "https://tjenester-q1.nav.no",
    "https://veiledearbeidssoker.nav.no": "https://www.dev.nav.no/arbeid/no",
    "https://www.nav.no/okonomi-og-gjeld": `https://okonomi-gjeldsradgivning-veiviser.dev.nav.no/okonomi-og-gjeld`,
    "https://www.nav.no": "https://www.dev.nav.no",
    "https://nav.no": "https://www.dev.nav.no",
};

type LookupTable = {
    [env in Exclude<NaisEnv, "prod">]: typeof devUrlLookupTable;
};

export const urlLookupTable: LookupTable = {
    dev: devUrlLookupTable,
};
