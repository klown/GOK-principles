# GOK Onscreen Keyboard

The GNOME Onscreen Keyboard (GOK) project was undertaken by the IDRC in the
early 2000s.  It was a way of providing a dynamic visual onscreen keyboard that
provide support for persons with motor disabilities.

***Dynamic*** - GOK was dynamic in the sense that activating a specific key led
to a new keyboard.  For example, the "Main" keyboard was made up of "Menus",
"Compose", "Window", "Mouse", "Activate", "Toolbars", "GOK", "UI Grab", and
"Launcher" keys.  If the current user context was an application with a menu
bar, pressing the "Menus" key would invoke a new keyboard that consisted of the
menus in the current menu bar.  Pressing the "File" key on that keyboard would
lead to a keyboard where each key was one of the File menu items, e.g., "New",
"Open..", "Close", "Save", "Save as...", etc.  In each case, whatever keyboard
was shown on screen was replaced with a new keyboard.  In all cases, there was a
"Back" key that would navigate back to the just previously shown keyboard, and,
in some cases, there were special keys to immediately navigate back up an entire
hierarchy quickly rather than pressing a long series of "Back" keys.

In addition, GOK supported a standard qwerty keyboard, as well as other layouts
of letters and numbers, for textual input.  It also supported a variety of
selection methods such as direct selection, single and double switch scanning,
inverse scanning, selection by joy stick, and other techniques.

GOK is now defunct, and has been [archived in GNOME's gitlab](https://gitlab.gnome.org/Archive/gok/-/tree/master).
The current project is for documenting features or ideas implemented in GOK that
might prove useful going forward.  It is not to revive the project in is current
form as an onscreen keyboard for GNOME/Linux.

## Keyboard Persistence

Some GOK keyboards were static and could be defined as data structures to be
loaded by the GOK software at run time, as needed.  The document
[GOKKeyboardPersistence.md](./GOKKeyboardPersistence.md) describes the XML
format used and suggests a way to encode the same information using JSON.

