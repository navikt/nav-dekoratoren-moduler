import React, { PropsWithChildren } from "react";
import parse from "html-react-parser";
import { DecoratorFetchProps } from "../../common/common-types";
import { fetchDecoratorHtml } from "../functions/fetch-decorator-next";

export interface DecoratorProps {
    decoratorProps: DecoratorFetchProps;
}

export async function Decorator({
    children,
    decoratorProps,
}: PropsWithChildren<DecoratorProps>): Promise<JSX.Element> {
    const Decorator = await fetchDecoratorHtml(decoratorProps);

    return (
        <>
            <head>{parse(Decorator.DECORATOR_STYLES, { trim: true })}</head>
            <body>
                <div
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: Decorator.DECORATOR_HEADER,
                    }}
                />
                {children}
                <div
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: Decorator.DECORATOR_FOOTER,
                    }}
                />
                {parse(Decorator.DECORATOR_SCRIPTS, { trim: true })}
            </body>
        </>
    );
}
