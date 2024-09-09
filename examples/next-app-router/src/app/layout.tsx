import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";
import { DecoratorParams } from "../../../../src/common/common-types";

export const metadata: Metadata = {
    title: "App-router med dekoratøren",
};

const RootLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const decoratorParams: DecoratorParams = {};

    const Decorator = await fetchDecoratorReact({
        env: "localhost",
        localUrl: "http://localhost:8100",
        params: decoratorParams,
    });

    return (
        <html lang="no">
            <head>
                <Decorator.HeadAssets />
            </head>
            <body>
                <Decorator.Header />
                {children}
                <Decorator.Footer />
                <Decorator.Scripts loader={Script} />
            </body>
        </html>
    );
};

export default RootLayout;
