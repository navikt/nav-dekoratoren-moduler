import { DecoratorElements, DecoratorFetchProps } from "../../common/common-types";
import parse from "html-react-parser";
import React, { FunctionComponent } from "react";
import { getDecoratorElements } from "./elements-service";

export type DecoratorComponentsReact = {
    Scripts: FunctionComponent;
    Header: FunctionComponent;
    Footer: FunctionComponent;
    HeadAssets: FunctionComponent;
};

const parseDecoratorHTMLToReact = (elements: DecoratorElements): DecoratorComponentsReact => {
    return {
        HeadAssets: () => <>{parse(elements.DECORATOR_HEAD_ASSETS)}</>,
        Scripts: () => <>{parse(elements.DECORATOR_SCRIPTS)}</>,
        Header: () => <>{parse(elements.DECORATOR_HEADER)}</>,
        Footer: () => <>{parse(elements.DECORATOR_FOOTER)}</>,
    };
};

export const fetchDecoratorReact = async (
    props: DecoratorFetchProps,
): Promise<DecoratorComponentsReact> => {
    return getDecoratorElements(props).then(parseDecoratorHTMLToReact);
};
