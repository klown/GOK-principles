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

export class BranchStack {
  
  // MAX_STACK_SIZE should be a constant.
  // TODO (JS): Strictly needed?  It might be used to make sure to not
  // accidentally try to push an infinite number of palettes.
  static MAX_STACK_SIZE = 50;
  
  // TODO (JS):  Should be a singleton?
  branchBackStack = [];

  /**
   * Initialize the branch stack to have zero entries, and a push/pop
   * difference of zero.
   */
  constructor() {
    this.branchBackStack.length = 0;
    this.pushPopDelta = 0;  // for debugging.
  }
  
  /**
   * Report if the branch stack is empty.
   * @return: `true` if the stack is empty; `false` otherwise.
   */
  isEmpty () {
    return this.branchBackStack.length === 0;
  }
  
  /**
   * Puah a palette onto the top of the branch stack.  If the palette was
   * created dynamically, and is already on the stack, ignore.
   * TODO (JS): Need to check if stack is full -- see MAX_STACK_SIZE
   * @param:  {Palette} palette The palette to push.
   */
  push (palette) {
    // Don't push `null` nor `undefined` values onto the stack.
    if (!palette) {
      return;
    }
    // Don't push dynamically created keyboards onto the stack more than
    // once (TODO (JS): what is the rationale?)
    if (this.branchBackStack.includes(palette) && palette.isDynamic) {
      console.log(`Palette ${palette.name} already on stack`);
      return;
    }
    // Using Array.push(): the most recently pushed palette is at the end
    // of the array.
    this.branchBackStack.push(palette);
    this.pushPopDelta++;
    console.log(`Palette ${palette.name} pushed onto stack`);
  }
   
  /**
   * Pop and return the most recently pushed palette from the top of the
   * branch stack.
   * @return {Palette} reference to the popped palette; null if the stack is
   *           empty.
   */
  pop () {
    if (this.isEmpty()) {
      return null;
    } else {
      // Using Array.pop(): the palette at the end of the array is
      // returned
      console.log(`Popping ${this.branchBackStack[0].name} off branch back stack`);
      this.pushPopDelta--;
      return this.branchBackStack.pop();
    }
  }
  /**
   * Return the palette at the top of the stack without popping it off.  If an
   * index is given, the palette at that index is returned.  Note that an
   * index of zero denotes the top of the stack.
   * @param {integer} stackIndex Optional: How far down the stack to peek,
   *                 where zero is the top of the stack (default).
   * @return {Palette} Reference to the palette at the top of the stack or at
   *           the given index; null if no palette is available.
   */
  peek (stackIndex = 0) {
    if (this.isEmpty()) {
      return null;
    } else {
      // Flip the index value since Array.push() puts the item at the end
      // of the array.
      index = (this.branchBackStack.length - stackIndex) - 1;
      let palette = null;
      if (index >= 0) {
        palette = this.branchBackStack[index];
        console.log(`Peeking ${this.branchBackStack[0].name} in branch back stack`);
      }
      return palette;
    }
  }

  /*
   * Accessor for the current value of the push/pop difference.
   * @return: {integer} The current difference between push and pop
   *            operations.  The value should never be negative.
   */
  get pushPopDifference() {
    return this.pushPopDelta;
  }

  /*
   * Set up the branch back handler for the given key
   * @param {Object} backKey The key on a palette that causes navigating
   *               back one palette.
   * @param {HTMLElement} keyboardContainerEl The element on the page where
   *                      the palettes are rendered.
   */
  setupBranchBackHandler (backKey, keyboardContainerEl) {
    const theStack = this;
    backKey.widget.addEventListener('click', function (event) {
      console.log(`Back handler: the rendering div is <div id="${keyboardContainerEl.id}"`);
      const previousPalette = theStack.branchBackStack.pop();
      if (previousPalette) {
        previousPalette.layoutKeyboard(keyboardContainerEl);
      } else {
        console.error("No previous palette to go back to");
      }
    });
  }

  /*
   * Set the style of the back key for the palette and add a handler to go
   * back to the previous palette.
   * @param palette {Palette} - The palette that with a `branchBack` key type.
   * @param keyboardContainerEl {Element} - Where to render the previous
   *                      palette.
   */
  initBackKey (palette, keyboardContainerEl) {
    // Only applies if there is a `branchBack` key.
    if (!palette.backKey || palette.backConfigured) {
      return;
    }
    var classString = palette.backKey.widget.getAttribute("class");
    classString = `${classString} branchBack`;
    palette.backKey.widget.setAttribute("class", classString);
    this.setupBranchBackHandler(palette.backKey, keyboardContainerEl);
    palette.backConfigured = true;
  }

  /*
   * Set up forward navigation handler
   * @param {Object} navKey - The key on the palette that causes navigating
   *               to another palette.
   * @param {Palette} fromPalette - The palette containing `navKey` which
   *                  we are navigating away from.
   * @param {Palette} targetPalette - The palette to navigate to.
   * @param {HTMLElement} keyboardContainerEl - The element on the page where
   *                        the palette are rendered.
   */
  setupNavigateForwardHandler (navKey, fromPalette, targetPalette, keyboardContainerEl) {
    const theStack = this;
    navKey.widget.addEventListener('click', (event) => {
      theStack.push(fromPalette);
      targetPalette.layoutKeyboard(keyboardContainerEl, this);
    });
  }

  /*
   * Hook up all static forward navigation (one time).
   * @param {Object} paletteStore - Object containing a list of all of the
   *                  palettes.
   * @param {HTMLElement} keyboardContainerEl - The element on the page where
   *                        the palette are rendered.
   */
  forwardNavigationHookup (paletteStore, keyboardContainerEl) {
    // Loop through the palettes
    paletteStore.paletteList.forEach((paletteName) => {
      console.log(`Palette name is ${paletteName}`);
      const aPalette = paletteStore.getNamedPalette(paletteName);
      this.setupPaletteForwardNavigation(aPalette, paletteStore, keyboardContainerEl);
    });
  }

  /*
   * Set up the navigation from one given palette to all others that its keys
   * navigate to.
   * @param {Palette} palette - The palette to set up.
   * @param {Object} paletteStore - Object containing a list of all of the
   *                  palettes.
   * @param {HTMLElement} keyboardContainerEl - The element on the page where
   *                        the palette are rendered.
   */
  setupPaletteForwardNavigation (palette, paletteStore, keyboardContainerEl) {
    // Loop through the keys of the palette checking if that key navigates
    // to another palette.
    Object.keys(palette.keys).forEach((keyID) => {
      var aKey = palette.keys[keyID];
      console.log(`....processing ${aKey.label} of ${palette.name}`);
      if (aKey.type === "branch" && aKey.target !== null) {
        console.log(`....${aKey.label} isa branch key with target = ${aKey.target}`);
        const targetPalette = paletteStore.getNamedPalette(aKey.target);
          if (targetPalette !== null) {
            this.setupNavigateForwardHandler(aKey, palette, targetPalette, keyboardContainerEl);
          }
        }
      });
   }
}
