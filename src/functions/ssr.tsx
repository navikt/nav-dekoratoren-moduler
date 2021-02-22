import React, { Fragment } from 'react';
import { JSDOM } from 'jsdom';
import { FunctionComponent } from 'react';
import { ENV, getDekoratorUrl } from './utils';
import { Params } from './params';

export interface Elements {
  styles: HTMLElement;
  scripts: HTMLElement;
  header: HTMLElement;
  footer: HTMLElement;
}

export interface Components {
  Styles: FunctionComponent;
  Scripts: FunctionComponent;
  Header: FunctionComponent;
  Footer: FunctionComponent;
}

export async function fetchDecoratorReact(
  env: ENV,
  params?: Params
): Promise<Components> {
  const elements = await fetchDecoratorHtml(env, params);
  return {
    Styles: () => <Fragment>{createReactElements(elements.styles)}</Fragment>,
    Scripts: () => <Fragment>{createReactElements(elements.scripts)}</Fragment>,
    Header: () => (
      <div dangerouslySetInnerHTML={{ __html: elements.header.innerHTML }} />
    ),
    Footer: () => (
      <div dangerouslySetInnerHTML={{ __html: elements.footer.innerHTML }} />
    )
  };
}

export async function fetchDecoratorHtml(
  env: ENV,
  params?: Params
): Promise<Elements> {
  const url = getDekoratorUrl(env, params);
  const res = await fetch(url);
  const body = await res.text();

  const { document } = new JSDOM(body).window;
  const styles = document.getElementById('styles');
  const scripts = document.getElementById('scripts');
  const header = document.getElementById('header-withmenu');
  const footer = document.getElementById('footer-withmenu');

  if (!styles || !scripts || !header || !footer) throw new Error(body);
  return { styles, scripts, header, footer };
}

const createReactElements = (element: Element) =>
  Object.values(element.children).map((element, key) =>
    createReactElement(element, key)
  );

const createReactElement = (element: Element, key: number) => {
  const tagName = element.tagName.toLowerCase();
  const attributes = Object.fromEntries(
    Object.values(element.attributes).map((a) => [a.name, a.value])
  );

  attributes.key = `${tagName}-${key}`;
  if (tagName === 'script') {
    // @ts-ignore
    attributes.async = true;
  }

  return React.createElement(tagName, attributes);
};
