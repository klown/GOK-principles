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

All keyboards have a `bDynamciallyCreated` property, a boolean that declares if that keyboard was built from a static predefined keyboard (false), or if the keyboard was generated at runtime from some aspect of the GUI (true).  If the keyboard was created dynamically, and it has one or more navigation key(s), it is not pushed to the BranchStack when one of those navigation keys is activated.  The rationale for this is unclear at present, but I can speculate.

As an example, suppose a keyboard is created dynamically to represent a "File" menu's menu items.  Those specific menu items are dependent on which window and application is frontmost when the keyboard is created.    Hence, the "File" keyboard is tied to a specific context at a specific time, and there is a chance that it will no longer be appropriate for the current time as time moves forward.  A safe approach is to recreate the "File" keyboard every time it is needed based on the current state of the frontmost "File" menu.  That approach is safer than reinstating an already built "File" keyboard from the BranchStack.

Thus, dynamic keyboards do not participate in the BranchStack navigation technique.   What happens if they have a "Back" button?  It is unclear if they do have "Back" keys since there is no running version of GOK to experiment with.  There are two possibilities:  One is that they do not have a "Back" key at all.  Or, if they do have a "Back" button, it would act as a quick jump back to the last statically defined keyboard on the BranchStack, the one that started the navigation down through a series of dynamically built keyboards.  And, it should be labelled appropriately, e.g., "Back to Main".



