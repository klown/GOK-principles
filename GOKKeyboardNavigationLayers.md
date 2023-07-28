# GOK Keyboard Navigation or Layers

These are notes describing the data structures and functions used by GOK when a key on one palette invokes another palette.  That is, activating the key in the first keyboard causes a new keyboard to replace the first.  This is sometimes referred to as "navigating from one palette to another", or that a given key on a palette represents another layer that will be displayed when that key is pressed.

## Navigation Data Structures

Some of the navigation information is specified in serialized keyboard XML files.  Other information is held inside the `GokKey` data struture -- a `GokKey ` represents a single key on a palette.  Still other information about the state of navigation is held in a data structure at runtime.

### The Runtime `BranchStack`

GOK used a stack to track the current location in the navigation layers.  As an illustration, consider a "Main" keyboard that contained a "Mouse" key, and a "Mouse" keyboard.  If Main's Mouse key was activaetd, it would cause the system to navigate to the Mouse keyboard.  When that happened, the Main keyboard would be pushed onto the top of the BranchStack.  The Mouse keyboard in turn contained a "Back" key.  When the Mouse's "Back" key was invoked, the keyboard stored on the top of the BranchStack is popped off the stack and used as the destination keyboard for navigating back.

In general, when a navigation key is activated, the currently displayed keyboard is pushed onto the stack, and the navigated-to keyboard is displayed.  If a second, third, or more navigation keys are pressed, each of their keyboards are pushed onto the stack as the user progresss through the subsequent keyboards.  Whenever the current keyboard's "Back" key is pressed, the keyboard on the top of the BranchStack is popped, and the system navigates back to that keyboard.  Successive BranchStack pops will navigate back to the starting keyboard, eventually.

Note that the use of a BranchStack means that a given keyboard's "Back" key, if any, does not need to be connected to particular keyboard to go back to.  All "Back" keys cause a BranchStack pop-and-display operation.  In this way, navigating back is not restricted to pairs of keyboards.  For example, the Mouse keyboard can navigate back to any keyboard other keyboard that inokded it, without knowing which keyboard that is.

Navigating forward, however, does require connecting the navigation key to the desired next keyboard.

### Information Specified in `.kbd` files

A `<key>` element has `type` and `target` properties.  With respect to navigation, there is an enumeration of `type` values that specify different kinds of branch navigation targets.  These are listed below.  If the branch value is not specific, the `target` attribute specifies the keyboard to navigate to using that keyboard's name.  The following lists the various branch values, and their associated `target` if any.

  - `branch` - `target` value specifies the name of the keyboard to navigate to,
  - `branchBack` - no `target`; use the BranchStack to navigate back,
  - `branchMenus` - no `target`; dynamically create and navigate to a "Menus" keyboard,
  - `branchToolbars` - no `target`; dynamically create and navigate to a "Tool bars" keyboard,
  - `branchMenuItems` - no `target`; dynamically create and navigate to a "Menu Items" keyboard,
  - `branchAlphabet` - no `target`; navigate to the alphanumeric keyboard,
  - `branchGUI` - no `target`; ??
  - `branchEditText` - no `target`; ?? 

### Information in `GokKey` data structure

If the keyboard is built from a ".kbd" file, then the `type` and `target` values are stored in the `GokKey->Type` and `GokKey->Target` data members.

If the keyboard is built dynamically, the `GokKey->Type` and `GokKey->Target` are set as appropriate to the context.  For example, if the keyboard represents a "File" menu's menu items, and one of those items leads to a sub-menu, its key will be set as a navigational key that, when pressed, causes the dynamic creation of a keyboard representing that sub-menu.  Note that the `Target` is irrelevant here since the sub-menu keyboard does not exist yet.  They target will be created when the key that represents the sub-menu is pressed.

### Dynamic Keyboards

All keyboards have a `bDynamciallyCreated` property, a boolean that declares if that keyboard was built from a static predefined keyboard (false), or if the keyboard was generated at runtime from some aspect of the GUI (true).  If the keyboard was created dynamically, and it has one or more navigation key(s), it is pushed onto the BranchStack only once when a navigation key is activated.  In contrast, a static keyboard can be pushed on the stack multiple times.

The rationale for this difference is unclear at present.  A related question is whether the BabyBlissBot palettes will ever be dynamic.

## Implications for the Baby Bliss Bot Project

1. The principle of having pre-set targets, like "branchMenus" is not a bad one.  But, it can be handled by the more general `{ type: "branch", target: "<some target>" }` specifier.  It's not clear what the advantage is for specific targets.  But, it is clear that it is unlikely that all of these specific special cases are useful to the BBB project.  For example, it's difficult to see the need for a menus layer in the BBB OSk, hence, the use of a "branchMenus" specifier.
2. The general `branch/target` combined with the BranchStack is a useful technique for setting up and handling forward and backward navigation.  It could be used by the BBB OSK.
3. It's unlikely that the BBB project will support dynamic keyboards.  I suspect that all of the keyboards will be defined by the keyboard editor and will be pre-set for each individual user.  At runtime, only those pre-set palettes will be used.  GOK's need for dynamic layering was because it grabbed the contents of the current state of the UI to build some of its keyboards.  Since the UI was constantly changing -- different menus, different toolbars, different open windows, and so on -- it could not have a pre-built set of palettes for all of these eventualities.  Is that necessary for the BBB OSK?




