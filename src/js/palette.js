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

class Palette {
    /* 
     * Fetch a palette definition file from the given url, create the palette,
     * and render it within the given page element.
     * @param url {String} - The url to the palette defintion file (JSON).
     * @param keyboardContainerEl {Element} - The HTML element that contains the
     *                                        palette.
     * @param paletteStore {PaletteStore} - Storage to keep track of completed
     *                                      palettes.
     * @param branchStack {BranchStack} - For tracking navigation from
     *                                    palette-to-palette.
     * @return The palette instance.
     */
    static createAndRenderPalette (url, keyboardContainerEl, paletteStore, branchStack) {
        var palette = new Palette();
        var palettePromise = palette.fromJsonUrl(url);
        palettePromise.then(function () {
            var rowsCols = palette.countRowsColumns();
            console.log(`rows: ${rowsCols.rows}, columns: ${rowsCols.cols}`);
            palette.layoutKeyboard(keyboardContainerEl, branchStack);
            paletteStore.addPalette(palette);
            console.log(`Done: built ${palette.name}`);
        });
        return palettePromise;
    }

    constructor() {
        this.keys = {};
        this.backConfigured = false;
        this.rootDiv = null;
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
    
    layoutKeyboard (keyboardContainer, branchStack) {
        if (this.rootDiv !== null && keyboardContainer !== null) {
            if (keyboardContainer === this.rootDiv.parent) {
                console.log("THEY BE EQUAL");
            }
            else {
                keyboardContainer.replaceChildren(this.rootDiv);
            }
            return;
        }
        // Restyle the `keyboardContainer` in terms of the number of columns
        this.rootDiv = document.createElement("div")
        this.rootDiv.setAttribute('class', 'keyboard-container');
        var style = this.rootDiv.style;
        style['background-color'] = 'gray';
        style['grid-template-columns'] = `repeat(${this.numCols}, auto)`;

        const items = Object.values(this.keys);
        var row = 1;
        items.forEach((anItem) => {
            var newKey = document.createElement("button");
            newKey.setAttribute("class", "button");
            var newText;
            if (anItem.image) {
                var imgElement = document.createElement("img");
                imgElement.setAttribute("src", `../keyboards/${anItem.image.url}`);
                imgElement.setAttribute("alt", "");
                newKey.appendChild(imgElement);
                newKey.appendChild(document.createElement('br'));
            }
            if (anItem.label) {
                newText = document.createTextNode(anItem.label);
                newKey.setAttribute("id", anItem.label);
                newKey.appendChild(newText);
            }
//            newKey.addEventListener("click", this.addKeyToOutput)
            // GOK keyboards are zero-based, grid CSS is one-based.
            const left = anItem.left + 1;
            const right = anItem.right + 1;
            const top = anItem.top + 1;
            const bottom = anItem.bottom + 1;
            newKey.style['grid-column'] = `${left} / ${right}`;
            newKey.style['grid-row'] = `${top} / ${bottom}`;
            this.rootDiv.appendChild(newKey);
            anItem.widget = newKey;
            
            // Update rows count -- if reached the end of a row, move to
            // to the next row.
            if (right > this.numCols) {
                row++;
            }
        })
        // Branchback key handling.
        // TODO (JS): Need a better way to get at the "main keyboard display",
        // It should be a configured piece of data accessed from anywhere.
        branchStack.initBackKey(this, document.getElementById("mainKbd-container"));

        if (keyboardContainer !== null) {
            keyboardContainer.appendChild(this.rootDiv);
        }
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

    addKeyToOutput(event) {
        const output = document.getElementById("output");  // yechh
        debugger;
//         const oldText = output.innerText;
//         const textToAdd = event.srcElement.innerText.trim();
//         output.innerText = `${oldText} ${textToAdd}`;
        const key = this.keyboard.keys['northwest']
        var itemToDisplay = document.createElement("div");
        if (key.image) {
            const imgPart = "<img width='32px' height='32px' src=`${key.image.url}`><br>";
        }
        if (key.label) {
            const textPart = key.label;
        }
        output.innerHTML = output.innerHTML + imgPart + textPart;
    }
}
