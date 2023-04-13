import { DecoratorFetchProps } from "../../common/common-types";
import { getCsrElements } from "../../common/csr-elements";

export const injectDecoratorClientSide = async (
    csrProps: DecoratorFetchProps
) => {
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
