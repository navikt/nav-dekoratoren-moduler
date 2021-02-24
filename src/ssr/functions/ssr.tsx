import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import NodeCache from "node-cache";
import { FunctionComponent, ReactElement } from "react";
import { getDekoratorUrl } from "./utils";
import { Params } from "@navikt/nav-dekoratoren-moduler";
import parse from "html-react-parser";
import { ENV, NAIS_ENV } from "../types/env";
import { Elements } from "../types/elements";

export type Props =
  | {
      env: NAIS_ENV;
      port: undefined;
      params?: Params;
    }
  | {
      env: ENV.LOCALHOST;
      port: number;
      params?: Params;
    };

// Refresh cache every hour
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
const cache = new NodeCache({
  stdTTL: SECONDS_PER_HOUR,
  checkperiod: SECONDS_PER_MINUTE,
});

export const fetchDecoratorHtml = async (props: Props): Promise<Elements> => {
  const url = getDekoratorUrl(props);
  const cacheData = cache.get(url);
  if (cacheData) {
    return new Promise((resolve) => resolve(cacheData as Elements));
  }

  return fetch(url)
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      const { document } = new JSDOM(res).window;
      const styles = document.getElementById("styles")?.innerHTML;
      const scripts = document.getElementById("scripts")?.innerHTML;
      const header = document.getElementById("header-withmenu")?.innerHTML;
      const footer = document.getElementById("footer-withmenu")?.innerHTML;

      if (!header || !footer || !styles || !scripts) {
        throw new Error("'Elements doesn't exist");
      }

      const elements = { styles, scripts, header, footer };
      cache.set(url, elements);
      return elements;
    });
};

export interface Components {
  Styles: FunctionComponent;
  Scripts: FunctionComponent;
  Header: FunctionComponent;
  Footer: FunctionComponent;
}

export const fetchDecoratorReact = async (props: Props): Promise<Components> =>
  fetchDecoratorHtml(props).then((elements) => ({
    Styles: () => parse(elements.styles) as ReactElement,
    Scripts: () => parse(elements.scripts) as ReactElement,
    Header: () => parse(elements.header) as ReactElement,
    Footer: () => parse(elements.footer) as ReactElement,
  }));
