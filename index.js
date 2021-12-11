const express = require("express");
const app = express();
const http = require("http")
const fs = require("fs")
const cp = require('child_process');
const process = require("process")
const server = http.createServer(app).listen(process.argv[2] || process.env.PORT || 9999,()=>{console.log(`http://localhost:${process.argv[2] || process.env.PORT ||  9999}`)})
const open = require('open');
const io = require('socket.io')(server)
const yt_dlp = "yt-dlp/yt-dlp.exe"

open(`http://localhost:${process.argv[2] || process.env.PORT ||  9999}`);
app.use(express.urlencoded({ extended: true }))
app.set('views', './views')
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/video",(req,res)=>{
    if(Object.keys(req.query).length==0)return res.redirect("/")
    ytdlp(req.query.url,req.query.format,req.query.list[1]);
})

app.get("/log",async(req,res)=>{
    datalist = []
    let data =await getAllFiles("public",datalist)
        res.render("log",{list:data})
})

io.sockets.on('connection', function(socket) {
    socket.emit('message', {'message': 'hello world'});
    socket.on("geturl",(data)=>{
        //console.log(data.list,data.format,data.url)
        let args = ["-4","--continue",`${data.list}`,"--embed-thumbnail","--newline","--embed-subs",'--embed-metadata',"-N 8",`-f ${data.format}`,"-P public/video/","-o %(title)s.%(ext)s",data.url]
        if(data.format=="ba") args = ["-4","--continue",`${data.list}`,"--newline","-N 8",`-f ${data.format}`,"-P public/audio/","-o %(title)s.%(ext)s",data.url]
        cp.execFile(yt_dlp,args,async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error}`)
                //return error;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            socket.emit('fromurl',{'error':error,"stdout":stdout,"stderr":stderr});
            socket.broadcast.emit("reloadreq",{"ready":1});
            return stdout ? stdout : stderr
        });
    })
});
const getAllFiles = function(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push({fullpath:dirPath+ "/"+ file,folder:dirPath.split("/")[1],name:file})
      }
    })
  
    return arrayOfFiles
}

const ytdlp =(url,format,playlist)=>{
    let args = ["-4","--continue",`${playlist}`,"--embed-thumbnail",'--embed-metadata',"-N 8",`-f ${format}`,"-P public/video/","-o %(title)s.%(ext)s",url]
    if(format=="ba") args = ["-4","--continue",`${playlist}`,"-N 8",`-f ${format}`,"-P public/audio/","-o %(title)s.%(ext)s",url]
        let res = cp.execFile(yt_dlp,args, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error}`)
            return error;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return stdout ? stdout : stderr
    });
}
