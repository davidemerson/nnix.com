+++
title = "Lunario sentimental"
slug = "lunario-sentimental"
date = 2024-12-19
description = "an English translation of the Lugones work."
[extra]
  toc = true
+++

# overview
One of my favorite books, [a lecture](https://nnix.com/reading/this-craft-of-verse/) by Jorge Luis Borges on writing, cites a Leopoldo Lugones work for which I can find no English translation.

> "The Argentine poet Lugones, way back in the year 1909, wrote that he thought poets were always using the same metaphors, and that he would try his hand at discovering new metaphors for the moon. And in fact he concocted many hundreds of them. He also said, in the foreword to a book called _Lunario sentimental_, that every word is a dead metaphor."

> Borges, _This Craft of Verse_, p. 22 (The Metaphor)

I am intrigued! Let's get a translation out in the world.

# original
The original work was published in 1909, and has since entered the public domain. You can download it [here](https://nnix.com/images/lunariosentimental/lunario_sentimental_original.pdf).

# translation
Spanish to English translation was done by Oskarina Perez. I hired her for her familiarity with the genre and the author.

I did some subsequent English editing work, in consultation with Oskarina.

# typesetting
I typeset the work in XeLaTeX, to provide modern font support. EB Garamond was chosen for its wide character support and, well, because it's beautiful.

Since this stuff matters, here's how I've configured EB Garamond in `fontspec`:
```
\setmainfont{EB Garamond}
    [
        UprightFont = EB Garamond Regular,
        ItalicFont = EB Garamond Italic,
        BoldFont = EB Garamond Bold,
        Ligatures = Common,
        StylisticSet = 6,
        Numbers = Proportional,
        Numbers = OldStyle
    ]
```
I wanted very much to set `Ligatures=Rare` because it looks awesome, but I can't justify it ergonomically for the readers I suspect will want this book. Some day maybe, on another less modern work.

# publication
TBD (almost certainly on demand, but I'm looking for a decent quality service.)