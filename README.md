# yt-downloader
using yt-dlp

<div style="font-weight:bold;">

* [Requirements](#Requirements)
   * [Node.js](#Node.js)
   * [ffmpeg](#ffmpeg)
      * [Windows](#Windows)
      * [Linux](#Linux)
* [Number](#Number)
    * [0亮1不亮](#Number-0亮1不亮)
    * [1亮0不亮](#Number-1亮0不亮)

</div>

##Requirements
## [Node.js](https://nodejs.org/en/download/)

## [ffmpeg](https://github.com/BtbN/FFmpeg-Builds/releases)
  ## Windows
  Download the zip file ,extract it and set the `bin/` directory to system's environment variables

  ## Linux
  Use your packages manager to download, i.e., `sudo apt install ffmpeg`

<hr>
=====================================
1. Run `npm install`.
2. Doubleclick the `start.sh` or type `node ./index.js {port}` to start with a different port.
3. By default,files are saved in the `public` folder.
4. 
=====================================

###.env(Optional)###

Name | Value | Description
---|---|---
ytdlp_path | "ytdlp/yt-dlp.exe" | Change ytdlp path to `ytdlp/yt-dlp.exe`,You also need to move the ytdlp file to there.#If you already install ytdlp onto your system you don't have to set it
downloadpath | "C://Users/User/Downloads/" | Change the download folder from `public` to `C://Users/User/Downloads/`
