import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

document.body.innerHTML = document.body.innerHTML.replace(
  "{{{STYLES}}}",
  `<link href=http://localhost:8088/dekoratoren/css/client.css rel="stylesheet" />`
);
document.body.innerHTML = document.body.innerHTML.replace(
  "{{{HEADER}}}",
  `<section id="decorator-header"></section>`
);
document.body.innerHTML = document.body.innerHTML.replace(
  "{{{FOOTER}}}",
  `<section id="decorator-footer"></section>`
);
document.body.innerHTML = document.body.innerHTML.replace(
  "{{{SCRIPTS}}}",
  `<div id="decorator-env" data-src="http://localhost:8088/dekoratoren/env?enforceLogin=True&level=Level4"></div>`
);

// Execute client.js
var script = document.createElement("script");
script.src = "http://localhost:8088/dekoratoren/client.js";
document.body.appendChild(script);

ReactDOM.render(<App />, document.getElementById('app'))
