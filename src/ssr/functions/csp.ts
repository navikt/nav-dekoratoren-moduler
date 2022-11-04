import { CSPDirectives as CSPDirectivesAll, getCSP } from "csp-header";
import { EnvProps } from "../../common/common-types";
import { getDecoratorUrl } from "../../common/urls";

type CSPDirectives = Partial<CSPDirectivesAll>;

const decoratorCspApi = "/api/csp";

const fallbackDirectives = {
    "default-src": ["*", "data:", "blob:", "'unsafe-inline'", "'unsafe-eval'"],
};

export const getCspHeader = async (
    appDirectives: CSPDirectives,
    envProps: EnvProps,
    retries = 3
): Promise<string> => {
    const url = `${getDecoratorUrl(envProps, false, false)}${decoratorCspApi}`;

    return fetch(url)
        .then((res) => {
            if (!res.ok) {
                if (retries > 0) {
                    return getCspHeader(appDirectives, envProps, retries - 1);
                }

                throw Error(`${res.status} ${res.statusText}`);
            }

            return res.json();
        })
        .then((decoratorDirectives: CSPDirectives) => {
            return getCSP({
                presets: [appDirectives, decoratorDirectives],
            });
        })
        .catch((e) => {
            console.error(
                `Error fetching decorator CSP, using permissive fallback directives! - ${e}`
            );
            return getCSP({ directives: fallbackDirectives });
        });
};
