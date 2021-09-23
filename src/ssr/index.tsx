import { ENV, Params, Props } from "../common/common-types";
import {
  fetchDecoratorReact,
  fetchDecoratorHtml,
  parseDecoratorHTMLToReact,
} from "./functions/ssr";
import { injectDecoratorServerSide } from "./functions/ssr";
import { Components, Elements } from "./functions/ssr";

export {
  injectDecoratorServerSide,
  fetchDecoratorReact,
  fetchDecoratorHtml,
  parseDecoratorHTMLToReact,
};

export type { Elements, Components, Params, Props, ENV };
