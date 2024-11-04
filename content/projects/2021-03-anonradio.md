+++
title = "aNONradio"
slug = "anonradio"
date = 2021-03-04
description = "a streaming setup for anon DJing."
[extra]
  toc = true
+++

I'm doing a volunteer spot on anonradio.net now Fridays, 21:00-22:00 UTC (17:00-18:00 EST).

This is the setup I'm using.

# Audio Hijack
I run Audio Hijack on Mac OS X. It's really slick. My recording session consists of capture from both the onboard MacBook Pro microphone and my Tidal client, from which I stream a playlist I curate for each session, whether live or recorded.

{{ img(id="/images/17-3.png", alt="Here's what the overall session looks like when configured.") }}

Here's what the overall session looks like when configured.

Note that you may want to add an output block to this session so you can monitor what you're playing. If you do that, keep feedback in mind. You don't want to have your voice playing through the speakers and being heard by the very same mic. Use headphones or something.

## live
When I'm going to livestream a show, I add the Broadcast block, configured for Icecast to the aNONradio servers.

{{ img(id="/images/17-1.png", alt="Here's what that block configuration looks like.") }}

Here's what that block configuration looks like.

## pre-recorded
When I'm going to pre-record a show, I add the recording block as the final session element, and I record to an MP3 file for upload to the SDF/aNONradio servers.

I record at the standard set for aNONradio.net, which is 192Kbps MP3 at 44.1 Hz Stereo. This is a custom setting in Audio Hijack.

{{ img(id="/images/17-2.png", alt="Here's what that block configuration looks like.") }}

Here's what that block configuration looks like.

## uploading
I record a single MP3 for the duration of my show with the filename
format: yyyymmddhhmm_djvole.mp3 and use anonymous FTP to upload
it to ftp://anonradio.net in the pub/incoming directory

I include include a file called yyyymmddhhmm_djvole.meta that
has these fields:
```
hhmmss:text:text:text:
```
For example:
```
000005:Belle & Sebastian:The Stars of Track and Field:BBC:
```
This sends Belle & Sebastian - The Stars of Track and Field - BBC at 5 seconds into the show to all the listening players.

# How do I listen?
[You just go here!](https://anonradio.net/listen/) 