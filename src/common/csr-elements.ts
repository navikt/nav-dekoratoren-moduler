import {
    DecoratorFetchProps,
    DecoratorUrlProps,
} from "./common-types";
import { getDecoratorEndpointUrl } from "./urls";
import {
    type EntryPoint,
    withMetadata,
} from "./decorator-moduler-metadata";

export const getCsrElements = (
    csrProps: DecoratorFetchProps,
    entryPoint: EntryPoint = "csr",
) => {
    const props: DecoratorUrlProps = {
        ...csrProps,
        csr: true,
    };

    const envUrl = getDecoratorEndpointUrl({
        ...props,
        params: withMetadata(props.params, entryPoint),
    });
    const assetsUrl = getDecoratorEndpointUrl({ ...props, params: undefined });
    const scriptSrc = `${assetsUrl}/client.js`;

    return {
        header: '<div id="decorator-header"></div>',
        footer: '<div id="decorator-footer"></div>',
        env: `<div id="decorator-env" data-src="${envUrl}"></div>`,
        styles: `<link href="${assetsUrl}/css/client.css" rel="stylesheet" />`,
        scripts: `<script src="${scriptSrc}" defer></script>`,
        scriptSrc,
    };
};
