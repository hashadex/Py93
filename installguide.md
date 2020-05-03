# Py93 Install Guide

This guide will tell you how to install Py93 to your Windows 93 PC.

## Step one
Create `Py93` folder in `/a/`.

## Step two
Copy this repository to your computer.

**Git:**
```
git clone https://github.com/hasha2982/Py93.git
```

**GitHub Desktop:**

* Open *GitHub Desktop*
* Go to *File* > *Clone repository* or press <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd>
* Choose *URL* tab, then paste `https://github.com/hasha2982/Py93.git` to the text area below.
* Press *Clone* button.

**GitHub: (web)**
* Go to the [root of this repository](https://github.com/hasha2982/Py93).
* Click on the *Clone or download* button, then choose *Download ZIP*.

## Step three

Drop cloned repository to Windows 93's `/a/` disk.

After that disk should look like that:
```
a
└ Py93
     ├ LICENSE
     ├ README.md
     ├ installguide.md
     ├ helper.js
     └ some other files and folders..
```

## Step four
Move `helper.js` from `/a/Py93/` to `/a/boot/`.

## Step five
Reboot your Windows 93 PC.

### **Finished!**

Now you can open `console.html` in `/Py93/` to open **Py93 Shell** or write `py93 c help` in the Windows 93 terminal to see `py93compile` (Py93 Compiler) usage.

Also, don't forget to check out [Brython documentation](https://brython.info/static_doc/en/intro.html?lang=en)!
Brython has it's own [`browser`](https://https://brython.info/static_doc/en/browser.html) package and some differences between Python.
For example: built-in function `input()` in Python lets you to type your input right into the console, but in Brython `input()` uses JavaScript's `prompt()` function, and instead of normal Pythonic behavior `input()` opens a standart browser window with a prompt.

> *Last updated: May 3, 2020*