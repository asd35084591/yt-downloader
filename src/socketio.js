const socket = io(/*"http://localhost:<%= port %>/"*/);
    socket.on('message', function(data){
    console.log(data.message);
});
socket.on("fromurl",(data)=>{
        console.log(data)
        if(data.stdout==="done") alert("Success !!")
        if(data.stdout1 === "info" && data.stdout2.includes("Writing video thumbnail")) document.getElementById("test-downloadThumb").checked = true
        if(data.stdout1 === "download"&& data.stdout2.includes("vtt") &&(data.stdout2.includes("Destination")||data.stdout2.includes("has already"))) document.getElementById("test-downloadSub").checked = true
        if(data.stdout1 === "download" && data.stdout2.includes("video")) document.getElementById("test-download-video").checked = true
        if(data.stdout1 === "download" && data.stdout2.includes("audio")) document.getElementById("test-download-audio").checked = true
        if(data.stdout1 === "EmbedSubtitle" && (data.stdout2.includes("video")||data.stdout2.includes("There aren't"))) document.getElementById("test-embedSub-video").checked = true
        if(data.stdout1 === "EmbedSubtitle" && (data.stdout2.includes("audio")||data.stdout2.includes("There aren't"))) document.getElementById("test-embedSub-audio").checked = true
        if(data.stdout1 === "Metadata" && data.stdout2.includes("video")) document.getElementById("test-embedMeta-video").checked = true
        if(data.stdout1 === "Metadata" && data.stdout2.includes("audio")) document.getElementById("test-embedMeta-audio").checked = true
        if(data.stdout1 === "EmbedThumbnail" && data.stdout2.includes("Adding thumbnail")&& data.stdout2.includes("video")) document.getElementById("test-embedThumb-video").checked = true
        appenddata(data)
})