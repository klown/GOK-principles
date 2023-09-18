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

import { render, Component } from "preact";
import { html } from "htm/preact";
import { PaletteKey } from "./PaletteKey.js";
import { PaletteStore } from "./PaletteStore.js";
import { BranchStack } from "./BranchStack.js";

/**
 * Retrieve the json file that defines the palette (keyboard).
 *
 * @param {String} jsonUrl - The URL of the JSON definition file for a palette.
 * @return {Object} - The palette taken from the `keyboard` member of the JSON.
 */
async function fromJsonUrl (jsonUrl) {
  try {
    var request = new Request(jsonUrl);
    const response = await fetch(request);
    const json = await response.json();
    return json.keyboard;
  }
  catch (err) {
    console.error(err);
    console.log(response.status)
    return null;
  }
}

/**
 * Given a palette defined as a set of properties, compute the number of rows
 * and columns in that palette.
 *
 * @param {Object} paletteDefinition - An object that lists the positions,
 *                 heights and widths of the keys in the palette.
 * @return {Object} - The row and column counts: `{ rows: ..., cols: ...}`.
 */
function countRowsColumns (paletteDefinition) {
  var rowCount = 0;
  var colCount = 0;
  const items = Object.values(paletteDefinition.keys);
  items.forEach((anItem) => {
    if (anItem.right > colCount) {
      colCount = anItem.right;
    }
    if (anItem.bottom > rowCount) {
      rowCount = anItem.bottom;
    }
  });
  return { rows: rowCount, cols: colCount };
}

/**
 * Create the palette's PaletteKeys and position them in their proper locations.
 * 1. Create a root <div> to hold all of the PaletteKeys,
 * 2. Style the root <div> using CSS grid display,
 * 3. Create and layout the PaletteKeys according to their positions/sizes,
 * 5. Setup any "branch back" keys (pending).
 * 6. Create sn array of PaletteKeys and store them in the passed in
 *    {pelletDefinition.keysArray}.
 * @param {Object} paletteDefinition - The properties of the palette and its
 *                                     keys.
 * @param {Object} branchStack - The branch-back stack used for navigation.
 */
function layoutPalette (paletteDefinition, branchStack) {
  // Create a <div> to hold the entire keyboard.  Then set its grid
  // CSS display in terms of the number of columns
  var rootDiv = document.createElement("div");
  rootDiv.setAttribute('class', 'keyboard-container');

  // Determine the number of rows and columns and set up some of the grid CSS.
  const rowsCols = countRowsColumns(paletteDefinition);
  var style = rootDiv.style;
  style['background-color'] = 'gray';
  style['grid-template-columns'] = `repeat(${rowsCols.numCols}, auto)`;

  // Loop to associate an interactive element with each key in
  // the palette, and set that element up in terms of its label and/or
  // TODO (JS):  Make keys a separate class?
  const items = Object.values(paletteDefinition.keys);
  var row = 1;
  var keysArray = [];
  items.forEach((anItem) => {
    // Set the style of the button to fit in the CSS display grid.  The
    // coordinates specified in the JSON are zero-based, whereas grid
    // CSS is one-based.
    // TODO (JS): revisit to make the JSON match the CSS.
    const left = anItem.left + 1;
    const right = anItem.right + 1;
    const top = anItem.top + 1;
    const bottom = anItem.bottom + 1;
    const gridStyles = `grid-column: ${left} / ${right}; grid-row: ${top} / ${bottom}`;
    const itemLabel = anItem.label || "";

    if (anItem.image) {
      var srcUrl = `./src/keyboards/${anItem.image.url}`;
      anItem.widget = html`<${PaletteKey} id=${itemLabel} class="button" style=${gridStyles} src=${srcUrl} alt="" children=${itemLabel} />`;
    } else {
      anItem.widget = html`<${PaletteKey} id=${itemLabel} class="button" style=${gridStyles} children=${itemLabel} />`;
    }
    keysArray.push(anItem.widget);
    // Update row count -- if reached the end of a row, move to
    // to the next row.
    if (right > rowsCols.numCols) {
      row++;
    }
  });
  // Branchback key handling.
  // TODO (JS): Hook up navigation,
  // TODO (JS): Need a better way to get at the "main keyboard display",
//      branchStack.initBackKey(this, document.getElementById("mainKbd-container"));

  // All of the palette's keys are initialized; store the array in the
  // `paletteDefinition` parameter.
  // TODO:  (JS) Consider the array as a return value.
  paletteDefinition.keysArray = keysArray;
}

class Palette extends Component {
  /* 
   * Fetch a palette definition file from the given url and create the palette.
   * @param url {String} - The url to the palette definition file (JSON).
   * @param paletteStore {PaletteStore} - Storage to keep track of completed
   *                    palettes.
   * @param branchStack {BranchStack} - For tracking navigation from
   *                    palette-to-palette.
   * @return {Promise} This is asynchronous due to loading the JSON
   *           definition of the palette.
   */
  static createPalette (url, paletteStore, branchStack) {
    var palette = new Palette();
    var palettePromise = fromJsonUrl(url);
    palettePromise.then(function (jsonPalette) {
      palette.fromJson(jsonPalette.keyboard);
      var rowsCols = countRowsColumns(palette);
      console.log(`rows: ${rowsCols.rows}, columns: ${rowsCols.cols}`);
      palette.createKeyboard(branchStack);
      paletteStore.addPalette(palette);
      console.log(`Done: built ${palette.name}`);
    });
    return palettePromise;
  }
  
  state = {configured: false};
  
  constructor () {
    super();
    this.keys = {};
    this.keysConfigured = false;
    this.backConfigured = false;
    this.keysArray = [];
  }

  fromJson (json) {
    Object.assign(this, json);
    return this;
  }

  componentDidMount () {
    if (!this.keysConfigured && this.props.json) {
      this.fromJson(this.props.json.keyboard);
      layoutPalette(this, globalBranchStack);
    }
    this.setState({configured: true});
  }

  /*
   * Render the keyboard on screen.  If the keyboard has not been created,
   * do that first.
   * @param {Object} props - Propoerties passed in by the main renderer.
   */
  render (props) {
    const rowsCols = countRowsColumns(this);
    const styles = `background-color: gray; grid-template-columns: repeat(${rowsCols.cols}, auto)`;
    return (html`
      <div>
        <h3 style="text-align: center">${this.name}</h3>
        <div class="keyboard-container" style=${styles}>
          ${this.keysArray}
        </div>
      </div>
    `);
  }
  
  /*
   * Return the palette's back key, if any.  The key in question has a
   * `type` of `branchBack`.  When the palette is searched, only the first key
   * with `type=branchBack` is returned.
   * @return - the first key of type `branchBack`; null if none found.
   */
  get backKey () {
    const keyIDs = Object.keys(this.keys);
    const backKeyID = keyIDs.find((keyID) => this.keys[keyID].type === "branchBack");
    return (backKeyID ? this.keys[backKeyID] : null);
  }
}

// Debugging code to get the main and mouse palettes loaded and rendered.

var globalPaletteStore = new PaletteStore();
var globalBranchStack = new BranchStack();

import mainKbdJson from "./keyboards/mainKbd.json";
render(html`<${Palette} json=${mainKbdJson} />`, document.getElementById("mainKbd-container"));

import mouseKbdJson from "./keyboards/mouseKbd.json";
render(html`<${Palette} json=${mouseKbdJson} />`, document.getElementById("mouseKbd-container"));

