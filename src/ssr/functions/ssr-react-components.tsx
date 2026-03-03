import { DecoratorFetchProps } from "../../common/common-types";
import htmlReactParser, {
    attributesToProps,
    DOMNode,
    domToReact,
    Element,
    HTMLReactParserOptions,
} from "html-react-parser";
import React, { FunctionComponent } from "react";
import { getDecoratorElements } from "./decorator-elements-service";

// @ts-expect-error Property 'default' exists on type
const parse = htmlReactParser.default as typeof htmlReactParser;

type ScriptsProps = { loader?: React.FunctionComponent };

export type DecoratorComponentsReact = {
    Scripts: FunctionComponent<ScriptsProps>;
    Header: FunctionComponent;
    Footer: FunctionComponent;
    HeadAssets: FunctionComponent;
};

const scriptReplacer = (ScriptLoader: React.FunctionComponent): HTMLReactParserOptions["replace"] =>
    function ScriptReplacer(domNode) {
        if (domNode instanceof Element && domNode.name === "script") {
            return (
                <ScriptLoader {...attributesToProps(domNode.attribs)}>
                    {domToReact(domNode.children as DOMNode[])}
                </ScriptLoader>
            );
        }
    };

export const fetchDecoratorReact = async (
    props: DecoratorFetchProps,
): Promise<DecoratorComponentsReact> => {
    return getDecoratorElements(props).then((elements) => ({
        HeadAssets: () => <>{parse(elements.DECORATOR_HEAD_ASSETS)}</>,
        Scripts: ({ loader }: ScriptsProps) => (
            <>
                {parse(elements.DECORATOR_SCRIPTS, {
                    replace: loader ? scriptReplacer(loader) : undefined,
                })}
            </>
        ),
        Header: () => <>{parse(elements.DECORATOR_HEADER)}</>,
        Footer: () => <>{parse(elements.DECORATOR_FOOTER)}</>,
    }));
};
