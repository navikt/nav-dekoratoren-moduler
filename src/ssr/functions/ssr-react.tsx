import { DecoratorFetchProps } from "../../common/common-types";
import htmlReactParser from "html-react-parser";
import React, { FunctionComponent } from "react";
import { getDecoratorElements } from "./elements-service";

// @ts-expect-error Property 'default' exists on type
const parse = htmlReactParser.default;

export type DecoratorComponentsReact = {
    Scripts: FunctionComponent;
    Header: FunctionComponent;
    Footer: FunctionComponent;
    HeadAssets: FunctionComponent;
};

export const fetchDecoratorReact = async (
    props: DecoratorFetchProps,
): Promise<DecoratorComponentsReact> => {
    return getDecoratorElements(props).then((elements) => ({
        HeadAssets: () => <>{parse(elements.DECORATOR_HEAD_ASSETS)}</>,
        Scripts: () => <>{parse(elements.DECORATOR_SCRIPTS)}</>,
        Header: () => <>{parse(elements.DECORATOR_HEADER)}</>,
        Footer: () => <>{parse(elements.DECORATOR_FOOTER)}</>,
    }));
};
