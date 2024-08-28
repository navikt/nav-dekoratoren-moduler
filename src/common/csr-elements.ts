import { DecoratorFetchProps, DecoratorUrlProps } from "./common-types";
import { getDecoratorEndpointUrl } from "./urls";
import { DecoratorElements } from "../ssr";

export const getCsrElements = (csrProps: DecoratorFetchProps) => {
    const props: DecoratorUrlProps = {
        ...csrProps,
        csr: true,
    };

    const envUrl = getDecoratorEndpointUrl(props);
    const assetsUrl = getDecoratorEndpointUrl({ ...props, params: undefined });
    const scriptSrc = `${assetsUrl}/client.js`;

    return {
        header: '<div id="decorator-header"></div>',
        footer: '<div id="decorator-footer"></div>',
        env: `<div id="decorator-env" data-src="${envUrl}"></div>`,
        styles: `<link href="${assetsUrl}/css/client.css" rel="stylesheet" />`,
        scripts: `<script src="${scriptSrc}" async></script>`,
        scriptSrc,
    };
};

export const getCsrFallback = (
    props: DecoratorFetchProps,
): DecoratorElements => {
    const csrElements = getCsrElements(props);

    return {
        DECORATOR_HEAD_ASSETS: csrElements.styles,
        DECORATOR_SCRIPTS: `${csrElements.env}${csrElements.scripts}`,
        DECORATOR_HEADER: csrElements.header,
        DECORATOR_FOOTER: csrElements.footer,
    };
};
