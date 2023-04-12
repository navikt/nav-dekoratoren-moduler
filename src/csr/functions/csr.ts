import { getDecoratorUrl } from "../../common/urls";
import {
    DecoratorEnvProps,
    DecoratorFetchProps,
    DecoratorParams,
} from "../../common/common-types";

type CSRProps = DecoratorEnvProps & { params?: DecoratorParams };

export const getCsrElements = (csrProps: CSRProps) => {
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

export const injectDecoratorClientSide = async (csrProps: CSRProps) => {
    const { env, header, scriptSrc, styles, footer } = getCsrElements(csrProps);

    document.head.insertAdjacentHTML("beforeend", styles);
    document.head.insertAdjacentHTML("beforeend", env);
    document.body.insertAdjacentHTML("afterbegin", header);
    document.body.insertAdjacentHTML("beforeend", footer);

    const script = document.createElement("script");
    script.async = true;
    script.src = scriptSrc;
    document.body.appendChild(script);
};
