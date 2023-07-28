# GOK Keyboard Editor

## UI File

- GOK editor's GUI definition file is [gok-editor.ui](https://gitlab.gnome.org/Archive/gok/-/blob/master/gok-editor.ui), a [Glade](https://en.wikipedia.org/wiki/Glade_Interface_Designer) file.
  - Glade was an editor for creating the GUI for a GNOME application.  It is no longer supported.
- The GOK editing environment was either a single window with a properties editor and a keyboard preview, or two separate windows.
- Users interacted with the properties editor, and used the preview window for feedback.
- The preview display was not interactive

## Editor Window GUI Tree

<figure>
    <img src="./images/GOKEditorGUI.png alt="GOK Editor GUI">
    <figcaption>Glade Image of GOK Editor GUI</figcaption>
</figure>

- Window -- "GOK Keyboard Editor"
  - Menu bar
    - File menu
      - New
      - Open
      - Save
      - Save As
      - Horizontal Separator
      - Quit
    - Help menu
      - About
  - Area below menu bar:
      - **Keyboard** section across top
         - Text Entry -- "Name:' -- edit the name of keyboard
         - Check box -- "Word Completion" -- whether this keyboard supports word completion
     - **Key** section down left side
         - For navigating among the keys on this keybaord
         - Button -- "-> Next Key"
         - Button -- "<- Previous Key"
         - Horizontal separator
         - Button -- "+ Add New Key"
         - Button -- "- Delete Key"
         - Button -- "Duplicate"
         - Horizontal separator
         - Button -- "To Front"
         - Button -- "To Back"
      - **Appearance** section to the right of the "Key" section
         - Combobox/Menu -- "Modifier"
             - choices are `{ shift, ctrl, alt, capslock, mod4, none }`
         - Combobox/Menu -- "Style"
             - many choices; some examples: `{ normal, branch, toggleselect, ...}`
             - Note: the Style of a key determines its colours, whether it contains a checkbox to indicate it is a toggle, and so on.  The Style is similar to a CSS class.  BUT, the Style does not provide position nor size information.
         - **Position** section
             - Four spin buttons -- "Left", "Right", "Top", "Bottom".
             - Values range from zero to 100
             - Note: units are rows/columns.  The "Right" and "Bottom" values express width and height in columns and rows.
          - **Type** section
             - Combobox/Menu
             - choices are `{ normal, modifier, branch, branchModal, branchMenus, ... }`
             - there are [45 types of keys](https://gitlab.gnome.org/Archive/gok/-/blob/master/gok/gok-key.h#L43).
          - **Modifier** section
             - Combobox/Menu -- "Name"
                 - choices are { shift, ctrl, alt, capslock, mod4 }
                 - used if the `type` above was set to `modifier`.
             - Radio buttons -- "3 State" and "Toggle"
             - Buttons -- "New" and "Delete"
          - **Branch** section
             - Combobox/Menu -- "Target"
                - choices are ?? a list of target-able keyboards ??
                - can enter name of keyboard to target?
          - **Output** section
             -  Radio buttons -- "Normal", "Modifier Pre", and "Modifier Post"
             -  Button -- "Delete" ??
             -  Button -- "Move Up" ??
             -  Button -- "Move Down" ??
             -  Button + Combobox/Menu -- "Add" Keysym:
                 - choices are the set of keysym values 
             -  Button + Combobox/Menu -- "Add" Keycode:
                 - choices are the set of key code values
             -  Button + Combobox/Menu -- "Add" GOK:
                 - choices are ??
          - **Font** section
             - Spin button -- "Font group"  
                 - Choose a font size group by index
                 - Sets the font size used for this key's textual label
             - Check box -- "Show Only This Font Group"
                 - Restrict the font size
