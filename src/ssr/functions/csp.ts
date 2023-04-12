import { CSPDirectives as CSPDirectivesAll, getCSP } from "csp-header";
import { DecoratorEnvProps } from "../../common/common-types";
import { getDecoratorUrl } from "../../common/urls";

type CSPDirectives = Partial<CSPDirectivesAll>;

const decoratorCspApi = "/api/csp";

const fallbackDirectives = {
    "default-src": ["*", "data:", "blob:", "'unsafe-inline'", "'unsafe-eval'"],
};

export const buildCspHeader = async (
    appDirectives: CSPDirectives,
    envProps: DecoratorEnvProps,
    retries = 3
): Promise<string> => {
    const url = `${getDecoratorUrl(envProps)}${decoratorCspApi}`;

    return fetch(url)
        .then((res) => {
            if (!res.ok) {
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
            if (retries > 0) {
                return buildCspHeader(appDirectives, envProps, retries - 1);
            }

            console.error(
                `Error fetching decorator CSP, using permissive fallback directives! - ${e}`
            );
            return getCSP({ directives: fallbackDirectives });
        });
};
