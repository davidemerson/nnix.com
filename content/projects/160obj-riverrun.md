+++
title = "riverrun"
slug = "riverrun"
date = 2025-01-14
description = "an infinite community stream."
[extra]
  toc = true
+++

{{ img(id="/images/160.obj/origin.png", alt="a toot from wakest which says, "there should really be a 24/7 merveilles radio stream") }}

# concept

Community is hard to build and coordinate. Radio stations require community, but largely because they require coordination and try to structure their programs too tightly. What if we let go of that structure, and allowed a community stream of music, collaboratively DJ'd?

- Make a directory of music somewhere.
- Have contributors give you ssh keys to manage identity for authentication.
- Have a stream app which grabs music from the directory of community submitted music.
- Have a sqlite or similar database which captures the metadata from all the music actually played. Contributor (string), track length (seconds), track artist (string), track title (string), track album (string), play started (unix epoch), play ended (unix epoch).
- Have some abuse protections in place. You're allowed not more than X seconds of upload per day, based on track metadata. We can make this a file size limit too.
- When a track is played, it is deleted from storage. Metadata is not retained for more than a certain amount of time, as well.

# some details

## stream
The stream should be a public url. MPEG-DASH, I suppose, since HLS is closed source.

## playlist
A database should keep a metadata record of all tracks played in the last 48 hours. This can be posted publicly as a playlist. Metadata older than 48 hours will be truncated to avoid retention and maintenance.

## storage & transfer
Let's assume we use SCP for transfer to the storage. All radio files can just be in one directory, we don't need to impose a naming convention.

If a user's upload exceeds the size limits of the service (see limits > file size below), the first-uploaded files will be kept, and those in excess of the file size limit will be deleted. If the upload consisted of a single file in excess of the file size limit, it will be deleted.

If a user's upload exceeds the time limit (see limits > time below), the first-uploaded files will be kept, and those in excess of the time limit will be deleted. If the upload consisted of a single file in excess of the file size limit, it will be deleted.

## selection
The streaming application will select the next file according to the order in which the file was uploaded to the storage directory. Oldest file gets played next, and the metadata for that file gets written to the playlist database when it is selected for play.

When a file has been played on the public stream, it will be deleted from storage, and the next-oldest file selected for play.

## authentication
Authentication need only be at the upload here, since the metadata is not sensitive. Community members should understand that the metadata of their tracks, and their usernames, will be public information.

Authentication should require a key of some sort. I think using SSH keys makes sense, per contributor, since they are then individually revocable when necessary, and they can be used to SCP files to a directory somewhere. This isn't as light on the user experience as uploading a file to a web interface, but it avoids the matter of federation and it avoids entangling a member's identity on the radio with their identity elsewhere, which could be desirable, at their discretion.

## limits

### time
We don't want anyone hogging the airtime. Seems like 1200 seconds, 20 minutes, of airtime per contributor per day is enough, as read from the metadata of the file(s) they upload. This can be enforced by proxy in the file size limits too.

This can also be changed easily if the community wants to change it in the future.

### file size
We don't want anyone destroying the server with wild amounts of data.

When calculating audio file size,
```
Size = (Sample Rate)*(Bit Depth)*(No. Channels)*(Duration, s)
```
So let's say you get 1200 seconds per day of contributions. Being extremely generous and assuming that's 32 bit (!) music at 48kHz stereo,
```
Size = 48,000*32*2*1200 = 3,686,400,000 bits = 460.8 MB
```
Compression in FLAC is usually something like 60%, so let's knock that back to 276 MB/day.

You get to upload not more than 276 MB/day, or 1200 seconds of audio, whichever you hit first.

### file type
Only the following file types are permitted, and all others will be deleted from storage:
- OGG
- FLAC

### overall storage & time
We have to set some kind of maximum on the total storage used by all files in-queue, just in case. Let's say that we don't allow more than 48 hours of storage at 32 bit / 48 kHz FLAC, compressed to 60%:
```
Limit = 48,000*32*2*172,800 = 528,384,000,000 bits = 66.04 GB
66.04 GB * 0.6 compression = about 40 GB
```

Ok, let's call it 50 GB limit on storage, total. When the service has this much data in its queue, a message is displayed on the playlist UI (public web page) and the upload mechanism is closed to authentication until the stored data drops below 30 GB, to avoid whiplash.

We should set a time limit too, which hopefully makes the storage limit only a secondary control. When the total playtime of all music in storage reaches 172,800 seconds, the upload mechanism is closed to authentication until the total playtime of all music in storage drops below 150,000 seconds. A message is displayed on the playlist UI (public web page) during this time.

## configuration
Configuration should be accomplished through a config file, plaintext. The following configuration parameters should be set in that file for the app:

- per user file size limit, in MB per day
- per user time length limit, in seconds per day
- file types accepted, by extension
- total queued maximum size limit, in GB
- total queued maximum time limit, in seconds
- metadata retention time, in seconds