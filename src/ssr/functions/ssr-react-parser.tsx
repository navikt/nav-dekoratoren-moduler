import { DecoratorFetchProps } from "../../common/common-types";
import parse from "html-react-parser";
import React, { FunctionComponent } from "react";
import { DecoratorElements, fetchDecoratorHtml } from "./ssr-fetch";

export type DecoratorComponents = {
    Styles: FunctionComponent;
    Scripts: FunctionComponent;
    Header: FunctionComponent;
    Footer: FunctionComponent;
    HeadAssets: FunctionComponent;
};

const parseDecoratorHTMLToReact = (
    elements: DecoratorElements,
): DecoratorComponents => {
    return {
        Styles: () => <>{parse(elements.DECORATOR_STYLES)}</>,
        Scripts: () => <>{parse(elements.DECORATOR_SCRIPTS)}</>,
        Header: () => <>{parse(elements.DECORATOR_HEADER)}</>,
        Footer: () => <>{parse(elements.DECORATOR_FOOTER)}</>,
        HeadAssets: () => <>{parse(elements.DECORATOR_HEAD_ASSETS)}</>,
    };
};

export const fetchDecoratorReact = async (
    props: DecoratorFetchProps,
): Promise<DecoratorComponents> => {
    return fetchDecoratorHtml(props).then(parseDecoratorHTMLToReact);
};
