# GOK Keyboard Persistence

## GOK Keyboard Elements

GOK keyboard files are expressed using xml, and have the extension '.kbd'.

The main elements are:

- `GokFile`
  - defines the `GOK` XML namespace `http://www.gnome.org/GOK`
- `keyboard`
  - container of a collection of `key` elements
  - `name` attribute, text label for the keyboard, e.g., `qwerty`, `launcher`
  - `commandprediction` attribute, boolean, `{ yes, no }`
  - `wordcompletion` attribute, boolean, `{ yes, no }`
  - `expand` attribute, enum: `{ never, sometimes }` or missing the attribute.
  - example: `<keyboard name="qwerty" wordcompletion="yes"> ... </keyboard>`
- `key`
  - must be within a `<keyboard>` element
  - provides characteristics of a single key.
  - attributes `left`, `right`, `top`, and `bottom` specify position in terms of
    rows and columns.
  - attribute `type`, an enum:

      ```
      { normal, branch, branchBack, branchWindows, settings, modifier, mouse, mousebutton }
      ```
  - attribute `modifier`, used if the `type=modifier`.  An enum:

        ```
        { shift, ctrl, alt, capslock, mod4 }
        ```
  - attribute `modifiertype`, optional and, if used, the `type=modifier` must be
    present.  The only values seen so far are `{ toggle, select-toggle }`.  A
    full example:

        ```
        <key type="modifier" modifier="capslock" modifiertype="toggle">
          <label>Caps Lock</label>
        </key>
        ```
  - attribute `action`, used with `type=mousebutton`, specifies the mouse
    button's action; enum:
    `{ button1, button2, button3, double1, double2, double3, latch }`
- `label`
  - must be nested within a `key` element
  - provides a label for the key, a human facing UI string.
- `image`
  - optional, must be nested within a `key` element, and partially or completely
    replaces the `<label>` element.
  - attribute `source`, the url of the image to use.
  - attribute `type`, possible values are `{ fixed:xx,yy, fit, ?? }`
  - attribute `align`, how to position the image within the key; enumerated 
    type: `{ left, right, ?? }` (The question marks, `??`, indicate that there
    may be other values.  The documentation is unclear).
- `output`
  - optional; must be nested within a `key` element.
  - defines any output caused by invoking the key.
  - attribute `type`.  Possible values are `{ keysym, keycode }`.
  - contents of the element is the output value, e.g., "comma".
  - Example: `<output type="keysym">comma</output>`

Note that there does not appear to be anything that specifies the number of
rows and columns in a given keyboard.  It might be implcit in the
`(left, top), (right, bottom)` coordinates for all of the key elements.

## XML Example -- Mouse Keyboard
The "mouse keyboard" is a set of keys that can by used to indirectly manipulate
the mouse pointer and mouse functionality.  There are keys for moving the mouse
pointer around the screen and keys for clicking the mouse buttons virtually. 
This is taken from the GOK archive [mouse.kbd](https://gitlab.gnome.org/Archive/gok/-/blob/master/mouse.kbd.in) file.

While there is no documentation explicitly saying so, it appears the keys are
placed in order beginning with the key in the top/left corner of the keyboard
and then listing them horizontally by row.  This inference is based on the
coordinates given in the list of keys, and that they progress across and down
a virtual grid, as one proceeds from `<key>` element to `<key>` element.

```
<?xml version="1.0"?>
<GOK:GokFile xmlns:GOK="http://www.gnome.org/GOK">

<GOK:keyboard name="mouse" wordcompletion="no" expand="sometimes">
	<GOK:key left="0" right="1" top="0" bottom="1" type="branchBack">
		<!-- Translators: short label for go back. -->
		<_GOK:label>back</_GOK:label>
	</GOK:key>
	<GOK:key left="1" right="2" top="0" bottom="1" type="mousebutton" action="latch">
		<!-- Translators: verb. -->
		<_GOK:label>Latch</_GOK:label>
	</GOK:key>
	<GOK:key left="2" right="4" top="0" bottom="1" type="pointer">
		<_GOK:label>Pointer</_GOK:label>
	</GOK:key>
	<GOK:key left="4" right="6" top="0" bottom="1" type="repeat-next">
		<_GOK:label>Repeat</_GOK:label>
	</GOK:key>
	<GOK:key left="0" right="1" top="1" bottom="2" type="mouse" dir="northwest">
		<!-- Translators: direction up and left (North West) -->
		<GOK:image source="NW.png" type="fixed:20,20"/>
	</GOK:key>
	<GOK:key left="1" right="3" top="1" bottom="2" type="mouse" dir="north">
		<GOK:image source="North.png" type="fixed:20,20"/>
	</GOK:key>
	<GOK:key left="3" right="4" top="1" bottom="2" type="mouse" dir="northeast">
		<GOK:image source="NE.png" type="fixed:20,20"/>
	</GOK:key>
	<GOK:key left="4" right="6" top="1" bottom="2" type="mousebutton" action="button1">
		<_GOK:label>Button 1</_GOK:label>
	</GOK:key>
	<GOK:key left="0" right="1" top="2" bottom="3" type="mouse" dir="west">
		<GOK:image source="West.png" type="fixed:20,20"/>
	</GOK:key>
	<GOK:key left="1" right="3" top="2" bottom="3" type="mousebutton" action="double1">
		<_GOK:label>Dbl Click</_GOK:label>
	</GOK:key>
	<GOK:key left="3" right="4" top="2" bottom="3" type="mouse" dir="east">
		<GOK:image source="East.png" type="fixed:20,20"/>
	</GOK:key>
	<GOK:key left="4" right="6" top="2" bottom="3" type="mousebutton" action="button2">
		<_GOK:label>Button 2</_GOK:label>
	</GOK:key>
	<GOK:key left="0" right="1" top="3" bottom="4" type="mouse" dir="southwest">
		<GOK:image source="SW.png" type="fixed:20,20"/>
	</GOK:key>
	<GOK:key left="1" right="3" top="3" bottom="4" type="mouse" dir="south">
		<GOK:image source="South.png" type="fixed:20,20"/>
	</GOK:key>
	<GOK:key left="3" right="4" top="3" bottom="4" type="mouse" dir="southeast">
		<GOK:image source="SE.png" type="fixed:20,20"/>
	</GOK:key>
	<GOK:key left="4" right="6" top="3" bottom="4" type="mousebutton" action="button3">
		<_GOK:label>Button 3</_GOK:label>
	</GOK:key>
</GOK:keyboard>
</GOK:GokFile>
``` 

## Example Using JSON
This is a guess on how a GOK XML keyboard file could be repurposed using JSON instead of XML, where the names of the JSON fields are the same as the XML elements and their attributes.

### Keys as Anonymous Array

There are two possibilities with respect to the collection of keys in a given keyboard.  One is to simply list them as an array of key structures.  The other is a set of named keys.  In both cases, the `key` element is no longer explicitly
declared, but each key's structure is captured either within an array or as a
named structure.

The following is an example of the first way to capture the set of keys as simply
an array:

```
"keyboard": {
    "name": "manage",
    "commandprediction": false,
    "wordcompletion": false,
    "keys": [{
            "left": 0,
            "right": 1,
            "top": 0,
            "bottom": 1,
            "type": "branchBack",
            "label": "back"
        },
        {
            "left": 1,
            "right": 2,
            "top": 0,
            "bottom": 1,
            "type": "branchWindows",
            "label": "Activate Window"
        },
        {
            "left": 2,
            "right": 3,
            "top": 0,
            "bottom": 1,
            "type": "settings",
            "label": "Settings"
        },
        {
            "left": 0,
            "right": 1,
            "top": 1,
            "bottom": 2,
            "type": "normal",
            "label": "Gok"
        },
        {
            "left": 1,
            "right": 2,
            "top": 1,
            "bottom": 2,
            "type": "normal",
            "label": "Other"
        },
        {
            "left": 2,
            "right": 3,
            "top": 1,
            "bottom": 2,
            "type": "normal",
            "label": "Pointer"
        }
    ]
}
```

### Keys as Named Structures

In the second case, each key has a unique id.  The array is replaced with a
`keys` block containing a set of key ids.  Each id acts as dictionary-key for a
structure.  For illustrative purposes the ids are based on the key's label:

```
{
    "keyboard": {
        "name": "manage",
        "commandprediction": false,
        "wordcompletion": false,
        "keys": {
            "back": {
                "left": 0,
                "right": 1,
                "top": 0,
                "bottom": 1,
                "type": "branchBack",
                "label": "back"
            },
            "activateWindow": {
                "left": 1,
                "right": 2,
                "top": 0,
                "bottom": 1,
                "type": "branchWindows",
                "label": "Activate Window"
            },
            "settings": {
                "left": 2,
                "right": 3,
                "top": 0,
                "bottom": 1,
                "type": "settings",
                "label": "Settings"
            },
            "gok": {
                "left": 0,
                "right": 1,
                "top": 1,
                "bottom": 2,
                "type": "normal",
                "label": "Gok"
            },
            "other": {
                "left": 1,
                "right": 2,
                "top": 1,
                "bottom": 2,
                "type": "normal",
                "label": "Other"
            },
            "pointer": {
                "left": 2,
                "right": 3,
                "top": 1,
                "bottom": 2,
                "type": "normal",
                "label": "Pointer"
            }
        }
    }
}
```

#### Keyboards as JSON files:

- [manageKbd.json](./manageKbd.json), based on [manage.kbd](https://gitlab.gnome.org/Archive/gok/-/blob/master/manage.kbd)
- [mouseKbd.json](./mouseKbd.json), based on [mouse.kbd](https://gitlab.gnome.org/Archive/gok/-/blob/master/mouse.kbd.in)
  - An image of the mouse keyboard is shown below:
  <img src="https://wiki.ubuntu.com/Accessibility/Reviews/GOK?action=AttachFile&do=get&target=gok04.png" alt="The GOK mouse keyboard">