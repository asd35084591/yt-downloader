const appenddata = (data)=>{
    //stdout
    if(data.stdout1===undefined && data.stdout2===undefined && data.stderr===undefined) return
    document.getElementById("stdout")===null?stdout = document.createElement("p"): stdout = document.getElementById("stdout")
    let mdtext = `[${data.stdout1===undefined?"":data.stdout1}] - ${data?.stdout2===undefined?"":data.stdout2}`
    let stdouttext = document.createTextNode(mdtext)
    document.getElementById("stdout").append(stdouttext,document.createElement("br"))
    stdout.style.backgroundColor = "green"
    //stderr
    document.getElementById("stderr")===null?stderr = document.createElement("p"): stderr = document.getElementById("stderr")
    let stderrtext = document.createTextNode(data.stderr)
    data.stderr===undefined?"":stderr.append(stderrtext,document.createElement("br"))
    stderr.style.backgroundColor = "red"
}
const url = document.getElementById("link");
const sendreq = (io = "geturl")=>{
    //let urlreg = new RegExp(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/).test(url.value)
    //let urlreg = new RegExp(/http(?:s?):\/\/(?:www\.)?youtu((?:be\.com\/watch\?v=|\.be\/)|(?:be\.com\/playlist\?list=))([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/).test(url.value)
    let urlreg = new RegExp(/http(?:s?):\/\/(?:www\.)?youtu((?:be\.com\/watch\?v=|\.be\/)|(?:be\.com\/playlist\?list=)|(?:be\.com\/c\/)|(?:be\.com\/channel\/))([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/).test(url.value)
    if(urlreg===false) {return alert("這不是一個youtube link!")}
    let videoformat = getradiovalue("videoformat");
    let playlistvideo = getradiovalue("playlist");
    let subtitle = getradiovalue("subtitle");
    let res = socket.emit(io, {'url': document.getElementById("link").value,"format":videoformat,"list":playlistvideo,"subtitle":subtitle});
    document.getElementById("stdout").innerHTML = "";
    document.getElementById("stderr").innerHTML = "";
    /*let data = await fetch(`video?url=${url.value}&format=${videoformat}&list=${playlistvideo}`);
    let res = await data.text;*/
}
const getradiovalue = (name)=>{
    let list = document.getElementsByName(name);
    for(let i = 0; i < list.length ; i++){
        if(list[i].checked){
            return list[i].value;
        }
    }
}