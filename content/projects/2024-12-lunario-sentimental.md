+++
title = "Lunario sentimental"
slug = "lunario-sentimental"
date = 2025-01-13
description = "an English translation of the Lugones work."
[extra]
  toc = true
+++

# overview
One of my favorite books, [a lecture](https://nnix.com/reading/this-craft-of-verse/) by Jorge Luis Borges on writing, cites a Leopoldo Lugones work for which I can find no English translation.

> "The Argentine poet Lugones, way back in the year 1909, wrote that he thought poets were always using the same metaphors, and that he would try his hand at discovering new metaphors for the moon. And in fact he concocted many hundreds of them. He also said, in the foreword to a book called _Lunario sentimental_, that every word is a dead metaphor."

> Borges, _This Craft of Verse_, p. 22 (The Metaphor)

I am intrigued! Let's get a translation out in the world.

# timeline
<body>
    <div class="timeline">
        <div class="timeline-item">
            <div class="date">24 December 2024</div>
            <div class="event">we're up to page 71 in translation work</div>
        </div>
        <div class="timeline-item">
            <div class="date">25 December 2024</div>
            <div class="event">poetry typesetting template complete</div>
        </div>
        <div class="timeline-item">
            <div class="date">01 January 2025</div>
            <div class="event">we're up to page 201 in translation work</div>
        </div>
        <div class="timeline-item">
            <div class="date">06 January 2025</div>
            <div class="event">we're finished with initial translation work</div>
        </div>
        <div class="timeline-item">
            <div class="date">7 January 2025</div>
            <div class="event">typesetting all poetry begins</div>
        </div>
        <div class="timeline-item">
            <div class="date">13 January 2025</div>
            <div class="event">the poetry typesetting is progressing well, about 50%, and I've developed a typesetting method for the plays, which was something of a task, since the `dramatist` package does not get along well with XeTeX inside of a `book` document type.</div>
        </div>
    </div>
</body>

# original
The original work was published in 1909, and has since entered the public domain. You can download it [here](https://nnix.com/images/lunariosentimental/lunario_sentimental_original.pdf).

The work contains 37 pieces:
- four plays
- four works of prose
- 29 poems

{{ img(id="/images/lunariosentimental/chapter-list.jpeg", alt="an index of 37 pieces of prose, poetry and plays in Lunario Sentimental") }}

# translation
Spanish to English translation was done by Oskarina Perez. I hired her for her familiarity with the genre and the author.

I did English editing work, in consultation with Oskarina.

# typesetting
I typeset the work in XeLaTeX, to provide modern font support.

## body font
[EB Garamond](https://en.wikipedia.org/wiki/EB_Garamond) was chosen for its wide character support and, well, because it's beautiful.

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
I wanted very much to set `Ligatures = Rare` because it looks awesome, but I can't justify it ergonomically for the readers I suspect will want this book. Some day maybe, on another less modern work. Here's Rare:

{{ img(id="/images/lunariosentimental/rare_ligatures.png", alt="lots of rare st ligatures") }}

You can't say these common ones aren't sick though, still. Here's Common:

{{ img(id="/images/lunariosentimental/ligatures.png", alt="a sick ligature on a Q") }}

## title font
[HFF High Tension](https://www.dafont.com/hff-high-tension.font) was chosen for the title font. It has a very simple character set, so we can't really use it outside titles.

{{ img(id="/images/lunariosentimental/high_tension.png", alt="LUNARIO SENTIMENTAL in High Tension font.") }}

## poetry
The poetry is set using the `poetry` package. There's really no trick to this, a poem looks as follows in the code,

```
\poemlinenumsfalse
\centerpoemoff
\begin{poem}
\textit{Che cotesta córtese opinione} \\
\textit{Ti fian chiavata in mezzo della testa.} \\!
\end{poem}
```

## plays
Plays were a bigger deal. I like the `dramatist` package a lot, but it doesn't work inside a `book` document type in XeLaTeX. So I made my own environment to format the plays, headers, and dramatis personae sections. Here's what it looks like in the preamble:
```
% Play environment with acts and scenes
\newenvironment{play}[1]{
    \section*{#1} % Title of the play
    \setlength{\parindent}{0pt} % No indentation
    \setlength{\parskip}{1em} % Space between paragraphs
}{
    \setlength{\parindent}{1em} % Restore default indentation
    \setlength{\parskip}{0pt} % Restore default spacing
}

% Commands for structured formatting of plays
\newcommand{\act}[1]{%
    \bigskip
    \centerline{\textsc{\Large\textbf{Act #1}}} % Large centered act header
    \bigskip
}
\newcommand{\scene}[1]{%
    \bigskip
    \centerline{\textsc{Scene #1}} % Centered small caps scene header
    \medskip
}
\newcommand{\character}[1]{%
    \textbf{#1.---}\hspace{1em} % Character names with em dash
}
\newcommand{\stage}[1]{%
    \textit{(#1)} % Italics for stage directions
}

% Dramatis Personae Environment
\newenvironment{dramatispersonae}{
    \medskip
    \centerline{\textsc{Dramatis Personae:}} % Centered small caps title
    \medskip
    \begin{list}{}{
        \setlength{\labelwidth}{3cm}  % Adjust label width
        \setlength{\leftmargin}{3.5cm} % Adjust left margin
        \setlength{\labelsep}{0.5em}   % Spacing between label and text
        \setlength{\itemsep}{0.5em}    % Space between items
    }
}{
    \end{list}
}

% Character listing command
\newcommand{\characterline}[2]{%
    \item[\textit{#1,}] #2 % Add \item for each character entry
}
```

And here's what a play looks like in code:
```
\begin{play}{ }

\begin{dramatispersonae}
    \characterline{Dalinda}{23 years old, blonde. Sister of Jacinto.}
    \characterline{Jacinto}{26 years old. Brother of Dalinda.}
    \characterline{Reinaldo}{20 years old. Friend of Jacinto and Dalinda's fiancé.}
\end{dramatispersonae}

\act{I}

\scene{1}

\character{Jacinto} This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line. This is an example dialogue line.

\character{Reinaldo} \stage{Turning to Jacinto} This is another example. This is another example. This is another example. This is another example. This is another example. This is another example. This is another example. This is another example. This is another example. This is another example. This is another example.

\scene{2}
\stage{It's really dark and foggy, the ground is on fire here and there.}

\character{Jacinto} says something else

\character{Reinaldo} indeed, another line

\character{Dalinda} \stage{Karate kicking Reinaldo}
```

This ends up looking as follows when compiled:

{{ img(id="/images/lunariosentimental/play_example.png", alt="The first page of a play to illustrate compiled formatting.") }}

# publication
TBD (almost certainly on demand, but I'm looking for a decent quality service.)