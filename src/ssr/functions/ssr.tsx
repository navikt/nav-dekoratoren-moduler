import React, { Fragment } from "react";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import NodeCache from "node-cache";
import { FunctionComponent } from "react";
import { ENV, getDekoratorUrl } from "./utils";
import { Params } from "@navikt/nav-dekoratoren-moduler";
import parse from "html-react-parser";

export interface Elements {
  styles: string;
  scripts: string;
  header: string;
  footer: string;
}

// Refresh cache every hour
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
const cache = new NodeCache({
  stdTTL: SECONDS_PER_HOUR,
  checkperiod: SECONDS_PER_MINUTE,
});

export const fetchDecoratorHtml = (
  env: ENV,
  params?: Params
): Promise<Elements> => {
  const url = getDekoratorUrl(env, params);
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

export const fetchDecoratorReact = async (
  env: ENV,
  params?: Params
): Promise<Components> =>
  fetchDecoratorHtml(env, params).then((elements) => {
    console.log(elements);
    return({
      Styles: () => <Fragment>{parse(elements.styles)}</Fragment>,
      Scripts: () => <Fragment>{parse(elements.scripts)}</Fragment>,
      Header: () => <Fragment>{parse(elements.header)}</Fragment>,
      Footer: () => <Fragment>{parse(elements.footer)}</Fragment>,
    })
  });
