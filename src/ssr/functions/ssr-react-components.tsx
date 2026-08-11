/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import { DecoratorFetchProps } from "../../common/common-types";
import type htmlReactParser from "html-react-parser";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser";
import type { FunctionComponent } from "react";
import { getDecoratorElements } from "./decorator-elements-service";

type ReactModule = typeof import("react");
type HtmlReactParserModule = typeof import("html-react-parser");

type ScriptsProps = { loader?: FunctionComponent };

export type DecoratorComponentsReact = {
    Scripts: FunctionComponent<ScriptsProps>;
    Header: FunctionComponent;
    Footer: FunctionComponent;
    HeadAssets: FunctionComponent;
};

const scriptReplacer = (
    ScriptLoader: FunctionComponent,
    react: ReactModule,
    parser: HtmlReactParserModule,
): HTMLReactParserOptions["replace"] => {
    const { createElement } = react;
    const { attributesToProps, domToReact, Element } = parser;

    return function ScriptReplacer(domNode) {
        if (domNode instanceof Element && domNode.name === "script") {
            return (
                <ScriptLoader {...attributesToProps(domNode.attribs)}>
                    {domToReact(domNode.children as DOMNode[])}
                </ScriptLoader>
            );
        }
    };
};

export const fetchDecoratorReact = async (
    props: DecoratorFetchProps,
): Promise<DecoratorComponentsReact> => {
    // react and html-react-parser are optional peer dependencies, used only by
    // this function. Importing them lazily lets consumers of the string-based
    // API skip installing them altogether.
    const [react, parser] = await Promise.all([import("react"), import("html-react-parser")]);

    const { createElement, Fragment } = react;
    // The CommonJS build of html-react-parser exposes parse as the default export
    const parse = (parser.default ?? parser) as typeof htmlReactParser;

    return getDecoratorElements(props).then((elements) => ({
        HeadAssets: () => <>{parse(elements.DECORATOR_HEAD_ASSETS)}</>,
        Scripts: ({ loader }: ScriptsProps) => (
            <>
                {parse(elements.DECORATOR_SCRIPTS, {
                    replace: loader ? scriptReplacer(loader, react, parser) : undefined,
                })}
            </>
        ),
        Header: () => <>{parse(elements.DECORATOR_HEADER)}</>,
        Footer: () => <>{parse(elements.DECORATOR_FOOTER)}</>,
    }));
};
