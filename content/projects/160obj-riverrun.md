+++
title = "riverrun"
slug = "riverrun"
date = 2025-01-15
description = "an infinite community stream."
[extra]
  toc = true
+++

{{ img(id="/images/160.obj/origin.png", alt="a toot from wakest which says, -there should really be a 24/7 merveilles radio stream-") }}

> "riverrun, past Eve and Adam's, from swerve of shore to bend of bay, brings us by a commodius vicus of recirculation back to Howth Castle and Environs."

# concept

code is committed in [GitHub here](https://github.com/davidemerson/riverrun).

Community is hard to build and coordinate. Radio stations require community, but largely because they require coordination and try to structure their programs too tightly. What if we let go of that structure, and allowed a community stream of music, collaboratively DJ'd?

- Make a directory of music somewhere.
- Have contributors give you ssh keys to manage identity for authentication.
- Have a stream app which grabs music from the directory of community submitted music.
- Have a sqlite or similar database which captures the metadata from all the music actually played. Contributor (string), track length (seconds), track artist (string), track title (string), track album (string), play started (unix epoch), play ended (unix epoch).
- Have some abuse protections in place. You're allowed not more than X seconds of upload per day, based on track metadata. We can make this a file size limit too.
- When a track is played, it is deleted from storage. Metadata is not retained for more than a certain amount of time, as well.

# some details

## stream
The stream should be a public url. It'll stream ogg, but we can convert a lot of stuff from original format to ogg, so upload formats will be somewhat flexible.

## playlist
A database should keep a metadata record of all tracks played in the last 48 hours. This can be posted publicly as a playlist. Metadata older than 48 hours will be truncated to avoid retention and maintenance.

## storage & transfer
Let's assume we use SCP for transfer to the storage. All radio files can just be in one directory, we don't need to impose a naming convention.

If a user's upload exceeds the size limits of the service (see limits > file size below), the first-uploaded files will be kept, and those in excess of the file size limit will be deleted. If the upload consisted of a single file in excess of the file size limit, it will be deleted.

If a user's upload exceeds the time limit (see limits > time below), the first-uploaded files will be kept, and those in excess of the time limit will be deleted. If the upload consisted of a single file in excess of the file size limit, it will be deleted.

## selection
The streaming application will select the next file according to the order in which the file was uploaded to the storage directory. Oldest file gets played next.

When a file has been played on the public stream, it will be deleted from storage, and the next-oldest file selected for play.

If there's nothing to play, the application waits until there is something to play.

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


# toml configuration
The configuration file is called riverrun.toml, and here's an example file.
```
[streamer]
# Where to find files to stream
StorageDir = "../queue/"

# Port for streaming
StreamPort = 8000

# Output directory for m3u file to configure streaming clients
m3uDirectory = "../"

[converter]
# Accepted File Types, comma separated
AcceptedFileTypes = [ 
          ".ogg",
          ".flac",
          ".wav",
          ".aac"
          ]

# Bitrate of channel, in kbps
Bitrate = 256

# Where the files uploaded by users will be stored
UploadDirectory = "../uploads/"

# Where the files converted will be stored
StreamDirectory = "../queue/"

[playlist]
# How long to keep metadata after play, seconds
Bitrate = 86400

[dashboard]
# Should we display upcoming songs?
DisplayUpcoming = Yes
```


# converter
The `converter` program is a Go-based utility that processes audio files from a specified upload directory, converts them to the Ogg Vorbis format, and stores the converted files in a specified stream directory. The program continuously monitors the upload directory for new files and processes them as they appear. Unsupported files are deleted automatically.

## features
- Converts only the specified audio file types defined in the configuration.
- Converts audio files to Ogg Vorbis with a specified bitrate.
- Waits for files to appear in the upload directory if none are present.
- Generates unique filenames for the converted files using UUID v7.
- Retains metadata from the original files during conversion.
- Provides detailed error messages for failed conversions.
- Verifies the presence of `ffmpeg` before execution.

## configuration
The program uses a section of the TOML configuration shared with all these other components of riverrun. Here's an example:

```toml
[converter]
AcceptedFileTypes = [
    ".ogg",
    ".flac",
    ".wav",
    ".aac"
]
Bitrate = 256
UploadDirectory = "path/to/uploads"
StreamDirectory = "path/to/stream"
```
- **AcceptedFileTypes**: List of file extensions the program will process. Extensions must include the leading dot (e.g., `.ogg`, `.flac`).
- **Bitrate**: Target bitrate (in kbps) for the Ogg Vorbis conversion.
- **UploadDirectory**: Path to the directory where files to be processed are uploaded.
- **StreamDirectory**: Path to the directory where converted files will be stored.

## execution
Run the program with the following command:
```bash
go run main.go <config-file>
```

## workflow
1. The program verifies the presence of `ffmpeg`.
2. Reads the configuration file specified as the first argument.
3. Monitors the `UploadDirectory` for files to process.
4. Converts valid files to Ogg Vorbis format.
5. Deletes processed files from the upload directory and stores the converted files in the `StreamDirectory`.
6. Waits for new files to appear if none are initially present.

## error handling
- If `ffmpeg` is not installed or accessible, the program exits with an error message.
- If a file cannot be converted, the program logs the detailed error output from `ffmpeg` and moves on to the next file.
- Unsupported file types are automatically deleted.

## directory monitoring
The program waits for files to appear in the upload directory by repeatedly checking every 5 seconds:
```go
for {
    files, err := ioutil.ReadDir(uploadDir)
    if err != nil {
        return fmt.Errorf("failed to read upload directory: %v", err)
    }

    if len(files) == 0 {
        fmt.Println("No files to process. Waiting for files to appear...")
        time.Sleep(5 * time.Second)
        continue
    }

    // Process files...
}
```

## file conversion
Uses `ffmpeg` for audio conversion:
```go
cmd := exec.Command(
    "ffmpeg",
    "-i", inputPath,
    "-c:a", "libvorbis",
    "-b:a", fmt.Sprintf("%dk", bitrate),
    outputPath,
)
```

## uuid-based file naming
Ensures unique filenames for converted files:
```go
func generateUUID() (string, error) {
    uuid := make([]byte, 16)
    _, err := rand.Read(uuid)
    if err != nil {
        return "", err
    }
    uuid[6] = (uuid[6] & 0x0f) | 0x70
    uuid[8] = (uuid[8] & 0x3f) | 0x80
    return hex.EncodeToString(uuid), nil
}
```

## dependencies
- **FFmpeg**: Required for audio file conversion. Ensure it is installed and accessible from the command line.

## logging and debugging
- The program provides detailed logs for each operation, including file processing, conversions, and errors.
- Example log output:
```plaintext
Running command: ffmpeg -i input.flac -c:a libvorbis -b:a 256k output.ogg
Failed to convert file input.flac: conversion failed
No files to process. Waiting for files to appear...
```

## contemplated
- Extend the `AcceptedFileTypes` to include new file extensions.
- Adjust the polling interval or use file system event listeners for real-time monitoring.
- Integrate a library for modifying metadata in converted files.

## issues
- The program uses a 5-second delay between directory scans, which may introduce slight processing delays.
- The program requires `ffmpeg` and does not currently include a fallback or alternative conversion tool.

## building
- install ffmpeg and get it in your PATH
- download source code, `converter.go`
- in your install folder, `go mod init streamer`
- get any dependencies, `go tidy`
- build `go build`
- modify the `[converter]` section of your `riverrun.toml` file as appropriate
- run program with path to config `./converter /path/to/riverrun.toml`



# streamer
The streamer is a Go-based application designed to stream `.ogg` files over HTTP. It ensures reliable file handling by managing conflicts and avoiding interruptions caused by files being copied or used during runtime. The program supports dynamic configurations via a TOML file.

## features
- Streams `.ogg` files from a specified directory to HTTP clients.
- Reads runtime configurations such as the streaming directory, port, and playlist directory from a TOML file.
- Waits to ensure files are not in use (e.g., being copied) before streaming.
- Delays deletion of previously streamed files until the next file begins streaming.
- Automatically detects the server's local IP address for constructing M3U playlists and streaming URLs.
- Generates an `.m3u` playlist with the streaming URL for easy integration with client players.

## configuration
The program uses a section of the TOML configuration shared with all these other components of riverrun. Here's an example:

```toml
[streamer]
# Directory containing files to stream
StorageDir = "../queue/"

# Port for the HTTP server
StreamPort = 8080

# Directory where the .m3u playlist will be saved
M3uDirectory = "../"
```

## function
1. The program reads its configuration from the TOML file specified as a command-line argument.
2. The `StorageDir` directory is monitored for `.ogg` files to stream.

## workflow
- The oldest `.ogg` file in the `StorageDir` directory is selected for streaming.
- Before streaming, the program waits to ensure the file is not being copied or written to by other processes.
- The selected file is streamed to clients via an HTTP endpoint (`/stream`).
- An `.m3u` playlist containing the streaming URL is generated and saved to the `M3uDirectory`.
- After streaming, the program retains the last streamed file until the next file begins streaming to avoid conflicts.


## endpoint

- url: `http://<local_ip>:<stream_port>/stream`
- method: GET
- content: `audio/ogg`

## execution
- Install Go on your system.
- Ensure the TOML configuration file is ready.
- Use the following command to run the program:
```bash
./streamer /path/to/config.toml
```

## errors
- The program retries accessing files that are temporarily unavailable.
- Logs errors related to binding or streaming and exits gracefully.

## notes
- Utilizes `sync.Mutex` to ensure file access and streaming operations are thread-safe.
- Dynamically determines the server's IP address for constructing streaming URLs.

## contemplated
- Add support for additional file formats by modifying the `getOldestFile` function.
- Implement additional logging or monitoring features as required.
- We still need to figure out where to implement limits. I think that'll be at the converter, but it depends on how we manage uploads. There might be an uploader program too.
- We need to think about people with low bandwidth. If you lower the stream quality, it'll sound bad. If you offer a bunch of different qualities, complexity increases. I think the best path might be to allow uploaders to mark music which they own for persistent availability as a download. We'll have to think this through.

## building
- download source code, `streamer.go`
- in your install folder, `go mod init streamer`
- get any dependencies, `go tidy`
- build `go build`
- modify the `[streamer]` section of your `riverrun.toml` file as appropriate
- run program with path to config `./streamer /path/to/riverrun.toml`



# playlist
The playlist program manages a tiny sqlite database of metadata, receives currently-playing notices from the streamer program, and prunes the metadata database to avoid over retention.

- I haven't gotten to this one yet, started work on the streamer and converter


# dashboard
The dashboard program grabs metadata about things which have been played from the playlist database and displays it to the public, so they know what's playing now, and what was playing in the past.

- I haven't gotten to this one yet, started work on the streamer and converter