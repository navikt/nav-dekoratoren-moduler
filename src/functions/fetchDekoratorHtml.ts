import { JSDOM } from "jsdom";
import { DekoratorParams, getDekoratorUrl } from "./getDekoratorUrl";

export interface DekoratorHtmlElements {
  styles: HTMLElement;
  scripts: HTMLElement;
  header: HTMLElement;
  footer: HTMLElement;
}

export default async function fetchDekoratorHtml(params?: DekoratorParams): Promise<DekoratorHtmlElements> {
  const url = getDekoratorUrl(params);
  const res = await fetch(url);
  const body = await res.text();

  const { document } = new JSDOM(body).window;

  const styles = document.getElementById("styles");
  const scripts = document.getElementById("scripts");
  const header = document.getElementById("header-withmenu");
  const footer = document.getElementById("footer-withmenu");

  if (!styles || !scripts || !header || !footer) throw new Error(body);

  return { styles, scripts, header, footer };
}
