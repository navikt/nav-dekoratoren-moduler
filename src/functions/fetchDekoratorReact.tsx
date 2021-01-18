import React, { FunctionComponent } from "react";
import { DekoratorParams } from "./getDekoratorUrl";
import fetchDekoratorHtml from "./fetchDekoratorHtml";

export interface DekoratorReactComponents {
  DekoratorStyles: FunctionComponent;
  DekoratorScripts: FunctionComponent;
  DekoratorHeader: FunctionComponent;
  DekoratorFooter: FunctionComponent;
}

export default async function fetchDekoratorReact(params?: DekoratorParams): Promise<DekoratorReactComponents> {
  const elements = await fetchDekoratorHtml(params);

  return {
    DekoratorStyles: () => <>{createReactElements(elements.styles)}</>,
    DekoratorScripts: () => <>{createReactElements(elements.scripts)}</>,
    DekoratorHeader: () => <div dangerouslySetInnerHTML={{ __html: elements.header["innerHTML"] }} />,
    DekoratorFooter: () => <div dangerouslySetInnerHTML={{ __html: elements.footer["innerHTML"] }} />,
  };

  function createReactElements(element: Element) {
    return Object.values(element.children).map((element, key) => createReactElement(element, key));
  }

  function createReactElement(element: Element, key: number) {
    const tagName = element.tagName.toLowerCase();
    const attributes = Object.fromEntries(Object.values(element.attributes).map((a) => [a.name, a.value]));

    attributes.key = `${tagName}-${key}`;

    if (tagName === "script") {
      // @ts-ignore
      attributes.async = true;
    }

    return React.createElement(tagName, attributes);
  }
}
