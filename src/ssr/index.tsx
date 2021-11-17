import { Env, Params, Props, Locale } from "../common/common-types";
import {
  fetchDecoratorReact,
  fetchDecoratorHtml,
  parseDecoratorHTMLToReact,
  injectDecoratorServerSideDom,
} from "./functions/ssr";
import { injectDecoratorServerSide } from "./functions/ssr";
import { Components, Elements } from "./functions/ssr";

export {
  injectDecoratorServerSide,
  injectDecoratorServerSideDom,
  fetchDecoratorReact,
  fetchDecoratorHtml,
  parseDecoratorHTMLToReact,
};

export type { Elements, Components, Params, Props, Env, Locale };
