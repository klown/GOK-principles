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

import { Component } from "preact";

export class PaletteKey extends Component {
    state = {hasImage: false};
    imgSrc = "";
    imgAlt = "";   
    
    setImageProperties (src, alt) {
        imgSrc = src;
        imgAlt = alt;
        this.state.hasImage = true; // use this.setState()?
    }
    
    render(props) {
        return (
            <button class={props.class} id={props.id} style={props.style}>
              {this.props.src ? <img src={this.props.src} alt={this.props.alt} /> : ""}
              {this.props.src ? <br /> : ""}
              {props.children}
            </button>
        );
    }
}
