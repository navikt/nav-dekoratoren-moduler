import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import NodeCache from "node-cache";
import { FunctionComponent, ReactElement } from "react";
import { getDekoratorUrl } from "./utils";
import { Params } from "@navikt/nav-dekoratoren-moduler";
import parse from "html-react-parser";
import fs from "fs";

export type ENV = "localhost" | "prod" | "dev" | "q0" | "q1" | "q2" | "q6";
export type Props = Params &
  (
    | { env: Exclude<ENV, "localhost"> }
    | { env: Extract<ENV, "localhost">; port: number | string }
  );

// Refresh cache every hour
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
const cache = new NodeCache({
  stdTTL: SECONDS_PER_HOUR,
  checkperiod: SECONDS_PER_MINUTE,
});

export interface Elements {
  DECORATOR_STYLES: string;
  DECORATOR_SCRIPTS: string;
  DECORATOR_HEADER: string;
  DECORATOR_FOOTER: string;
}

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

      const elements = {
        DECORATOR_STYLES: styles.trim(),
        DECORATOR_SCRIPTS: scripts.trim(),
        DECORATOR_HEADER: header.trim(),
        DECORATOR_FOOTER: footer.trim(),
      };

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
    Styles: () => parse(elements.DECORATOR_STYLES) as ReactElement,
    Scripts: () => parse(elements.DECORATOR_SCRIPTS) as ReactElement,
    Header: () => parse(elements.DECORATOR_HEADER) as ReactElement,
    Footer: () => parse(elements.DECORATOR_FOOTER) as ReactElement,
  }));

export type Injector = Props & {
  filePath: string;
};

export const injectDecorator = async (props: Injector): Promise<string> =>
  fetchDecoratorHtml(props).then((elements) => {
    const file = fs.readFileSync(props.filePath).toString();
    const dom = new JSDOM(file);
    const head = dom.window.document.head;
    const body = dom.window.document.head;
    head.insertAdjacentHTML("beforeend", elements.DECORATOR_STYLES);
    head.insertAdjacentHTML("beforeend", elements.DECORATOR_SCRIPTS);
    body.insertAdjacentHTML("beforebegin", elements.DECORATOR_HEADER);
    body.insertAdjacentHTML("beforeend", elements.DECORATOR_FOOTER);
    return dom.serialize();
  });
