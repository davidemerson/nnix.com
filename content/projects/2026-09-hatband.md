+++
title = "hatband"
slug = "hatband"
date = 2026-09-10
description = "privacy first contact exchange."
[extra]
  toc = true
+++

Source lives at [github.com/davidemerson/hatband](https://github.com/davidemerson/hatband). The site is [hatband.link](https://hatband.link).

Hatband is a business card exchange app incapable of, an uninterested in, mining your data. It shows your contact details as a QR code, from the Lock Screen if you like, and remembers where you met the people you scan.

### why

Exchanging contact information with someone you've just met, and don't yet trust, is an unsolved problem.

The apps that do it well want your address book, and you hand over everyone you know so that a stranger can have your phone number. The rest assume you are one person with one set of details, and that seems unlikely too. I have a card for the day job, one for the things I build, and one for people I'd rather not have calling the day job.

So Hatband does two things

- It collects nothing, and 
- it lets you carry more than one card.

### personas

Your persona is the full set of fields: name, company, phone, email, website, GitHub, LinkedIn, Mastodon, Signal, Calendly, SSH key, GPG fingerprint, and anything custom you want to add.

### how a card travels

A card is a QR code. Point a camera at it and you get a link to hatband.link with the card packed into the URL fragment, which a browser never sends to the server. The page decodes it in the browser, verifies the signature, and offers Add to contacts.

{{ img(id="/images/hatband/link-molly-bloom.png", alt="hatband.link showing a scanned card for Molly Bloom") }}
what someone without the app sees. This one is a compact card, the Lock Screen kind, which carries a fingerprint of the key rather than a signature.

The same card can go out as a `.hatband` file, as a bubble in Messages, or printed as SVG, PNG or a PDF card. Someone with the app lands in a review sheet, and those without get the web page.

### what leaves the phone

Key lookups against WKD, keys.openpgp.org, GitHub and Mastodon; Safari for a link you tapped; Apple's map tiles when the Where tab opens.

There is no Hatband server, and no analytics, heck, no third-party code at all: the app links nothing it didn't write except Apple's frameworks. Crash reports stay on the phone until you choose to share one. I have no way of knowing you installed it.

Scanned cards live in a Class A store, each sealed under a Keychain key that the app lock puts behind Face ID. They stay out of backups unless you opt in. Your own card is plaintext, so showing it never prompts. Export puts the seed, your card and everyone you've met into one file sealed with a passphrase.

### the format

A card is a CBOR map with small integer keys, encoded deterministically and signed with Ed25519, about 256 bytes. It travels as `https://hatband.link/#1<base32>`, or as a file behind the magic bytes `HB1\0`.

### get it

The App Store listing is [apps.apple.com/app/id6809843834](https://apps.apple.com/app/id6809843834), live once review is through. iOS only for now.