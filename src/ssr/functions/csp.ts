import { CSPDirectives as CSPDirectivesAll, getCSP } from "csp-header";

type CSPDirectives = Partial<CSPDirectivesAll>;

const decoratorCspApi = "http://localhost:8088/dekoratoren/api/csp";

const fallbackDirectives = {
    "default-src": ["*", "data:", "blob:", "unsafe-inline", "unsafe-eval"],
};

const removeDuplicates = (array: string[]) =>
    array.filter(
        (directive, index, array) => array.indexOf(directive) === index
    );

const mergeDirectives = (
    appDirectives: CSPDirectives,
    decoratorDirectives: CSPDirectives
): CSPDirectives => {
    return Object.entries({ ...decoratorDirectives, ...appDirectives }).reduce(
        (acc, [directiveName, appDirectiveValue]) => {
            if (!Array.isArray(appDirectiveValue)) {
                return acc;
            }

            const decoratorDirectiveValue = decoratorDirectives[directiveName];
            if (!decoratorDirectiveValue) {
                return acc;
            }

            return {
                ...acc,
                [directiveName]: removeDuplicates([
                    ...decoratorDirectiveValue,
                    ...appDirectiveValue,
                ]),
            };
        },
        {}
    );
};

export const getCspHeader = async (
    appDirectives: CSPDirectives,
    retries = 3
): Promise<string> =>
    fetch(decoratorCspApi)
        .then((res) => {
            if (!res.ok) {
                if (retries > 0) {
                    return getCspHeader(appDirectives, retries - 1);
                }

                throw Error(`${res.status} ${res.statusText}`);
            }

            return res.json();
        })
        .then((decoratorDirectives: CSPDirectives) => {
            return getCSP({
                directives: mergeDirectives(appDirectives, decoratorDirectives),
            });
        })
        .catch((e) => {
            console.error(
                `Error fetching decorator CSP, returning very permissive fallback directives! - ${e}`
            );
            return getCSP({ directives: fallbackDirectives });
        });
