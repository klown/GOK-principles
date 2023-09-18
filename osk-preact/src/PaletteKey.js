/*
 * Copyright 2023 Inclusive Design Research Centre, OCAD University
 * All rights reserved.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/klown/GOK-principles/blob/main/LICENSE
 */

"use strict";

import { render } from "preact";
import { useState } from "preact/hooks";
import { html } from "htm/preact";

export function PaletteKey (props) {
  if (props.src && props.src !== "") {
    return html`
      <button class="${props.class}" id="${props.id}" style="${props.style}">
        <img src="${props.src}" alt="${props.alt}" /> <br/>
        ${props.children}
      </button>
    `;
  } else {
    return html`
      <button class="${props.class}" id="${props.id}" style="${props.style}">
        ${props.children}
      </button>
    `;
  }
}
