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
    var palettePromise = palette.fromJsonUrl(url);
    palettePromise.then(function () {
      var rowsCols = palette.countRowsColumns();
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

  async fromJsonUrl (jsonUrl) {
    try {
      var request = new Request(jsonUrl);
      const response = await fetch(request);
      const json = await response.json();
      this.fromJson(json.keyboard);
      return true;
    }
    catch (err) {
      console.error(err);
      console.log(response.status)
      return false;
    }
  }

  fromJson (json) {
    Object.assign(this, json);
    return this;
  }

  countRowsColumns () {
    var rows = 0;
    var cols = 0;
    const items = Object.values(this.keys);
    items.forEach((anItem) => {
      if (anItem.right > cols) {
        cols = anItem.right;
      }
      if (anItem.bottom > rows) {
        rows = anItem.bottom;
      }
    });
    this.numRows = rows;
    this.numCols = cols;
    return { rows: this.numRows, cols: this.numCols };
  }
  
  componentDidMount () {
    if (!this.keysConfigured && this.props.json) {
      this.fromJson(this.props.json.keyboard);
      this.createKeyboard(globalBranchStack);
    }
    this.setState({configured: true});
  }
  
  /*
   * Create the keyboard and its keys:
   * 1. Create a root <div> to hold all of the keys,
   * 2. Style the root <div> using CSS grid display,
   * 3. Create <button>s for each key to support user interaction,
   * 4. Layout the <buttons> according to the keys' defined positions/sizes,
   * 5. Setup any "branch back" keys.
   * @param {Object} branchStack - the branch back stack used for navigation.
   */
  createKeyboard (branchStack) {
    // Create a <div> to hold the entire keyboard.  Then set its grid
    // CSS display in terms of the number of columns
    this.rootDiv = document.createElement("div")
    this.rootDiv.setAttribute('class', 'keyboard-container');
    var style = this.rootDiv.style;
    style['background-color'] = 'gray';
    style['grid-template-columns'] = `repeat(${this.numCols}, auto)`;

    // Loop to associate an interactive element with each key in
    // the palette, and set that element up in terms of its label and/or
    // TODO (JS):  Make keys a separate class?
    const items = Object.values(this.keys);
    var row = 1;
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
      
      // Update row count -- if reached the end of a row, move to
      // to the next row.
      if (right > this.numCols) {
        row++;
      }
    });
    // Branchback key handling.
    // TODO (JS): Need a better way to get at the "main keyboard display",
    // It should be a configured piece of data accessed from anywhere.
//      branchStack.initBackKey(this, document.getElementById("mainKbd-container"));
    
    // All of the palette's keys are initialized; create the key array
    var keysArray = [];
    items.forEach((anItem) => {
      keysArray.push(anItem.widget);
    });
    this.keysArray = keysArray;
  }

  /*
   * Render the keyboard on screen.  If the keyboard has not been created,
   * do that first.
   * @param {Object} props - Propoerties passed in by the main renderer.
   */
  render (props) {
    const rowsCols = this.countRowsColumns();
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


// Really rough code just to get the main palette loaded and rendered.  Need
// to figure out how to pass the url to the `mainKbd.json` file

var globalPaletteStore = new PaletteStore();
var globalBranchStack = new BranchStack();

import mainKbdJson from "./keyboards/mainKbd.json";
render(html`<${Palette} json=${mainKbdJson} />`, document.getElementById("mainKbd-container"));

import mouseKbdJson from "./keyboards/mouseKbd.json";
render(html`<${Palette} json=${mouseKbdJson} />`, document.getElementById("mouseKbd-container"));


// var palettePromise = Palette.createPalette("./src/keyboards/mainKbd.json", globalPaletteStore, globalBranchStack);
var x = 5;
var y = 32;
console.log(x + y);

