import { Props } from "../../common/common-types";
import { buildUrl, naisUrls } from "../../common/urls";

export const getDecoratorUrl = (props: Props): string => {
  if (props.env === "localhost") {
    const { port, dekoratorenUrl, ...params } = props;
    if (dekoratorenUrl) {
      return buildUrl(dekoratorenUrl, params);
    }
    const url = `http://localhost:${port}/dekoratoren`;
    return buildUrl(url, params);
  } else {
    const { env, ...params } = props;
    const url = naisUrls[env] || naisUrls.prod;
    return buildUrl(url, params);
  }
};
