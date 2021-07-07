import { Params } from "../../common-types";
import { getDecoratorUrl } from "./utils";

export type ENV = "localhost" | "prod" | "dev" | "q0" | "q1" | "q2" | "q6";
export type Props = Params &
  (
    | { env: Exclude<ENV, "localhost"> }
    | { env: Extract<ENV, "localhost">; port: number | string }
  );

export const injectDecoratorClientSide = async (props: Props) => {
  const url = getDecoratorUrl({ ...props });
  const urlWithParams = getDecoratorUrl({ ...props, withParams: true });

  const header = '<div id="decorator-header"></div>';
  const footer = '<div id="decorator-footer"></div>';
  const scripts = `<div id="decorator-env" data-src="${urlWithParams}"></div>`;
  const styles = `<link href="${url}/css/client.css" rel="stylesheet" />`;

  document.head.insertAdjacentHTML("beforeend", styles);
  document.head.insertAdjacentHTML("beforeend", scripts);
  document.body.insertAdjacentHTML("beforebegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);

  var script = document.createElement("script");
  script.async = true;
  script.src = `${url}/client.js`;
  document.body.appendChild(script);
};
