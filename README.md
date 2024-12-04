# AutoKB
Implementation of a virtual system  keyboard for Beckhoff TF2000 1.12.+

Keyboard pops up with a different layouts, numeric or (possibly localized) text. It centers on a screen and displays:
* indirect windows with value to edit
* range indicator, if applicable
* hides password
 
# Tested
1.12.758.8,
1.12.760.37
1.12.762.42

# Use
1. Copy the AutoKeyboard folder('s contents) to your project.
1. Insert one AKB usercontrol to each your .view. Size it accordingly to your needs, then you may hide it away (visibility = collapsed) for development purposes.
1. Add your keyboard layouts. Make sure to use INDIRECT keyboards.
1. Adjust AKB's parameters for different keyboard layouts. If the parameter is a localized string, keyboard's layout is language-dependent. Do *NOT* modify the keyboard's layout directly.
1. Bonus step: if a dark theme is going to be used, also copy over the dark-indirect.css file.

# Ceveat
TypeScript is used, so it won't work in the TcShell directly, as it lacks the TS transpiler.
