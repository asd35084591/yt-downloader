# yt-downloader
using yt-dlp

#Need to have `Node.js` installed#

1. Run `npm install`.
2. Doubleclick the `start.sh` or type `node ./index.js {port}` to start with a different port.
3. By default,files are saved in the `public` folder.

=====================================

###.env(Optional)###

Name | Value | Description
---|---|---
ytdlp_path | "ytdlp/yt-dlp.exe" | Change ytdlp path to `ytdlp/yt-dlp.exe`,You also need to move the ytdlp file to there.#If you already install ytdlp onto your system you don't have to set it
downloadpath | "C://Users/User/Downloads/" | Change the download folder from `public` to `C://Users/User/Downloads/`
