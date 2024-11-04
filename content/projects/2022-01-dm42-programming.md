+++
title = "dm42 programs"
slug = "dm42"
date = 2022-01-07
description = "an rpn machine I use daily."
[extra]
  toc = true
+++

# overview
I keep a DM42 from [SwissMicros](https://www.swissmicros.com) on my desk at all times. The DM42 is a metal-bodied calculator with a MIP display and 5x8 keypad, and you can flash it with whatever OS you'd like if you don't want to run what comes with it.

The calculator the DM42 is meant to emulate is the HP42. I am not an HP42 purist, that machine was before my time. I am, however, a devotee of [Reverse Polish Notation (RPN)](https://en.wikipedia.org/wiki/Reverse_Polish_notation), and the DM42 supports that.

I flash my DM42 with another OS - [C47](https://c47.miraheze.org/wiki/Main_Page). C47 has far more functions than I require for daily use, but I appreciate the comprehensiveness.

Practically speaking, I also appreciate:
* support for units and unit conversions
* support for keystroke programming
* (since keystroke programming sucks) support for uploading programs
* fully customizable menus

# programs
I keep my programs [here on GitHub](https://github.com/davidemerson/DM42). Making one is simple, however - you write the program in plaintext, then generate a .raw file, then upload it to the calculator.

Here's an example of a program I use to calculate the amount of concrete needed for a given form or mold:

```
00 { 216-Byte Prgm }
01▸LBL "CONC"
02 "SLAB WIDTH IN?"
03 INPUT "WIDIN"
04 "SLAB LEN IN?"
05 INPUT "LENIN"
06 "SLAB THICK IN?"
07 INPUT "THKIN"
08 "BAG YIELD FT3?"
09 INPUT "BAGYD"
10 "BAG WT LB?"
11 INPUT "BAGLB"
12 RCL "WIDIN"
13 RCL× "LENIN"
14 RCL× "THKIN"
15 .000578704
16 ×
17 STO "SLCUFT"
18 RCL "BAGYD"
19 RCL÷ "BAGLB"
20 STO "WTCUFT"
21 RCL "SLCUFT"
22 RCL÷ "WTCUFT"
23 STO "LBREQ"
24 "REQ POUNDS"
25 RCL "LBREQ"
26 END
```

Almost any function in the OS can be called in a program, and there are a dizzying array of them. If you require compatibility with the HP42 functions because you have old programs to port over, you should use the default DM42 OS. If you have upgraded to C47 like I did, though, the documentation is [here](https://47calc.com/documentation/combined/doc.html), and it is excellent.

# photos
{{ img(id="/images/IMG_2053.jpg", alt="A DM42 calculator, running C47 OS.") }}
A DM42 calculator, running C47 OS.