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

class BranchStack {
    
    // MAX_STACK_SIZE should be a constant.
    // TODO (JS): Strictly needed?  It might be used to make sure to not
    // accidentally try to push an infinite number of palettes.
    static MAX_STACK_SIZE = 50;
    
    // TODO (JS):  Check if there is a stack library or built-in stack API.
    // TODO (JS):  Rationale for singleton?
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
     * @param:  {Palette} -  The palette to push. 
     */
    push (palette) {
        // Don't push `null` nor `undefined` values onto the stack.
        if (!palette) {
            return;
        }
        // Don't push dynamically created keyboards onto the stack more than
        // once.
        if (this.branchBackStack.includes(palette) && palette.isDynamic) {
            console.log(`Palette ${pallete.name} already on stack`);
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
     *                   empty.
     */
    pop () {
        if (this.isEmpty()) {
            return null;
        } else {
            // Using Array.pop(): the palette at the end of the array is
            // returned
            console.log(`Palette ${palette.name} popped off stack`);
            this.pushPopDelta--;
            return this.branchBackStack.pop();
        }
    }

    /**
     * Accessor for the current value of the push/pop difference.
     * @return: {integer} The current difference between push and pop
     *                    operations.  The value should never be negative.
     */
     get pushPopDifference() {
        return this.pushPopDelta;
     }    
}
