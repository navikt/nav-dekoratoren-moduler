import React from "react";
import { DecoratorParams } from "@navikt/nav-dekoratoren-moduler";
import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";

type Props = {
    params?: DecoratorParams;
    children: React.ReactNode;
};

export const WithDecorator = async ({ params, children }: Props) => {
    const { DECORATOR_HEAD_ASSETS, DECORATOR_HEADER, DECORATOR_FOOTER, DECORATOR_SCRIPTS } =
        await fetchDecoratorHtml({
            env: "localhost",
            localUrl: "http://localhost:8089",
            noCache: true,
        });

    return <></>;
};
