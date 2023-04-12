import { DecoratorCSRProps, DecoratorFetchProps } from "./common-types";
import { getDecoratorUrl } from "./urls";

export const getCsrElements = (csrProps: DecoratorCSRProps) => {
    const props: DecoratorFetchProps = {
        ...csrProps,
        csr: true,
        serviceDiscovery: false,
    };

    const envUrl = getDecoratorUrl(props);
    const assetsUrl = getDecoratorUrl({ ...props, params: undefined });
    const scriptSrc = `${assetsUrl}/client.js`;

    return {
        header: '<div id="decorator-header"/>',
        footer: '<div id="decorator-footer"/>',
        env: `<div id="decorator-env" data-src="${envUrl}"/>`,
        styles: `<link href="${assetsUrl}/css/client.css" rel="stylesheet" />`,
        scripts: `<script src="${scriptSrc}" async/>`,
        scriptSrc,
    };
};
