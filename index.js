const express = require("express");
const app = express();
const http = require("http")
const fs = require("fs")
//const cp = require('child_process');
const process = require("process")
const server = http.createServer(app).listen(process.argv[2] || process.env.PORT || 9999,()=>{console.log(`http://localhost:${process.argv[2] || process.env.PORT ||  9999}`)})
const open = require('open');
const io = require('socket.io')(server)
const yt_dlp = "yt-dlp/yt-dlp.exe"
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap(yt_dlp);
//open(`http://localhost:${process.argv[2] || process.env.PORT ||  9999}`);

app.use(express.urlencoded({ extended: true }))
app.set('views', './views')
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/src', express.static('src'));

app.get("/",(req,res)=>{
    res.render("index",{port:process.argv[2] || process.env.PORT ||  9999})
})

app.get("/log",async(req,res)=>{
    datalist = []
    let data =await getAllFiles("public",datalist)
        res.render("log",{list:data,port:process.argv[2] || process.env.PORT ||  9999})
})

io.sockets.on('connection', function(socket) {
    socket.emit('message', {'message': 'hello world'});
    socket.on("geturl",(data)=>{
        console.log(data)
    let args = ["-4",
    "--continue",
    `${data.list}`,
    "--newline",
    '--embed-metadata',
    "--all-subs",
    "--embed-subs",
    "-N 8",
    "-o %(title)s.%(ext)s",
    data.url
    ]
    if(data.subtitle!==undefined){args.push(data.subtitle)}
    if(data.format.split(" ").length!==2 && data.format!=="ba") {args.push("--embed-thumbnail"),args.push("-P public/video/"),args.push(`-f ${data.format}`)}
    if(data.format==="ba") args.push("-P public/audio/"),args.push(`-f ${data.format}`)
    if(data.format.split(" ").length===2) {args.push(data.format.split(" ")[0]),args.push(data.format.split(" ")[1]),args.push("-P public/thumbnail/")}
    console.log(args)

    let ytDlpEventEmitter = ytDlpWrap
    .exec(args)
    .on('ytDlpEvent', (eventType, eventData) =>socket.emit('fromurl',{"stdout1":eventType===undefined?"":eventType,"stdout2":eventData===undefined?"":eventData}))
    .on('error', (error) => socket.emit('fromurl',{'stderr':error.message})
    )
    .on('close', () => {
        socket.emit('fromurl',{"stdout":`done`})
        socket.broadcast.emit("reloadreq",{"ready":1});
    }
    );
    console.log(ytDlpEventEmitter.ytDlpProcess.pid);
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
/*
const ytdlp =(url,format,list)=>{
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
}
*/