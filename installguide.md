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
     ├ brython
     │       ├ console.html
     │       └ some other files and folders...
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

Now you can open `console.html` in `/Py93/brython` to open **Py93 Shell**.

Or you can move `.lnk42` file from `/Py93/lnk` to your desktop. You can open the shell using this shortcut.

> *Last updated: April 20, 2020*