const appenddata = (data) => {
	//stdout
	if (data.stdout1 === undefined && data.stdout2 === undefined && data.stderr === undefined) return;
	document.getElementById('stdout') === null
		? (stdout = document.createElement('p'))
		: (stdout = document.getElementById('stdout'));
	let mdtext = `[${data.stdout1 === undefined ? '' : data.stdout1}] - ${
		data?.stdout2 === undefined ? '' : data.stdout2
	}`;

	let stdouttext = document.createTextNode(mdtext);
	document.getElementById('stdout').append(stdouttext, document.createElement('br'));
	stdout.style.backgroundColor = 'green';
	if (data?.stdout2?.split('%')[0] != data?.stdout2) {
		handleTimelineUpdate(data.stdout2.split('%')[0] + '%');//Progress bar
		document.getElementById('progress').innerText = `${data.stdout2.split('%')[0] + '%'}`;
	}
	//stderr
	document.getElementById('stderr') === null
		? (stderr = document.createElement('p'))
		: (stderr = document.getElementById('stderr'));
	let stderrtext = document.createTextNode(data.stderr);
	data.stderr === undefined ? '' : stderr.append(stderrtext, document.createElement('br'));
	stderr.style.backgroundColor = 'red';
};
const timelineContainer = document.querySelector('.timeline-container');
function handleTimelineUpdate(percent) {
	timelineContainer.style.setProperty('--progress-position', parseFloat(percent));
}

const url = document.getElementById('link');
const sendreq = (io = 'geturl') => {
	//let urlreg = new RegExp(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/).test(url.value)
	//let urlreg = new RegExp(/http(?:s?):\/\/(?:www\.)?youtu((?:be\.com\/watch\?v=|\.be\/)|(?:be\.com\/playlist\?list=))([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/).test(url.value)
	let urlreg = new RegExp(
		/http(?:s?):\/\/(?:www\.)?youtu((?:be\.com\/watch\?v=|\.be\/)|(?:be\.com\/playlist\?list=)|(?:be\.com\/c\/)|(?:be\.com\/channel\/))([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
	).test(url.value);
	if (urlreg === false) {
		return alert('這不是一個youtube link!');
	}
	let videoformat = getradiovalue('videoformat');
	let playlistvideo = getradiovalue('playlist');
	let subtitle = getradiovalue('subtitle');
	let res = socket.emit(io, {
		url: document.getElementById('link').value,
		format: videoformat,
		list: playlistvideo,
		subtitle: subtitle,
		cookies: document.getElementById('output').textContent,
	});
	document.getElementById('stdout').innerHTML = '';
	document.getElementById('stderr').innerHTML = '';
};
const getradiovalue = (name) => {
	let list = document.getElementsByName(name);
	for (let i = 0; i < list.length; i++) {
		if (list[i].checked) {
			return list[i].value;
		}
	}
};
function debounce(cb, delay = 1000) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			cb(...args);
		}, delay);
	};
}
document.getElementById('inputfile').addEventListener('change', function () {
	var fr = new FileReader();
	fr.onload = function () {
		document.getElementById('output').textContent = fr.result;
	};

	fr.readAsText(this.files[0]);
});
document.getElementById('download').addEventListener('click', debounce(reqdeb));
function reqdeb() {
	console.log('send');
	sendreq();
}
