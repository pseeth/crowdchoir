var context;
var recorder;
var gain;
var currentAudio;
var currentBlob;
var BUFFERS;
var bufferLoader;

var AUDIOFILES = [filename];

music = {playing: false, recording: false};

music.record = function() {
	music.recording = !music.recording;
	if (music.recording) {
		$("#record").html('<span class="glyphicon glyphicon-stop"></span> Stop');
		recorder && recorder.record();
	}
	else {
		$("#record").html('<span class="glyphicon glyphicon-record"></span> Record');
		recorder && recorder.stop();
		createDownloadLink();
		recorder.clear();
		$("#submit").attr('disabled', false);
		$("#preview").attr('disabled', false);
	}
}

music.play = function (which, loop) {
	this.audio = createSource(BUFFERS[which], loop);

	if (!this.audio.source.start) {
		this.audio.source.noteOn(0);
	} else {
		this.audio.source.start(0);
	}

	function createSource(buffer, loop) {
		var source = context.createBufferSource();
		source.buffer = buffer;
		source.loop = loop;
		return {
			source: source,
		};
	}
	switch (which) {
		case 0:
			$("#playstop").html('<span class="glyphicon glyphicon-stop"></span> Stop');
			break;
		case 1:
			$("#preview").html('<span class="glyphicon glyphicon-stop"></span> Stop');
			break;
	}
			
}

music.stop = function(which) {
	switch (which) {
		case 0:
			$("#playstop").html('<span class="glyphicon glyphicon-play"></span> Listen');
			break;
		case 1:
			$("#preview").html('<span class="glyphicon glyphicon-play"></span> Listen');
			break;
	}
	if (!this.audio.source.stop) {
		this.audio.source.noteOff(0);
	} else {
		this.audio.source.stop(0);
	}
}

music.toggle = function(which, loop) {
	this.playing ? this.stop(which) : this.play(which, loop);
	this.connect();
	this.playing = !this.playing;
}

music.connect = function() {
	this.audio.source.disconnect();
	this.audio.source.connect(context.destination);
}

function startUserMedia(stream) {
	var input = context.createMediaStreamSource(stream);
	console.log('Media stream created.' );
	console.log("input sample rate " +input.context.sampleRate);

	gain = context.createGain();
	input.connect(gain);
	console.log('Input connected to dummy gain.');

	recorder = new Recorder(input);
	console.log('Recorder initialised.');
	$("#record").attr('disabled', false);
}


function createDownloadLink() {
	recorder && recorder.exportWAV(function(blob) {
    	var url = (window.URL || window.webkitURL).createObjectURL(blob);
		currentAudio = url;
		currentBlob = blob;
		if (AUDIOFILES.length > 1) {
			AUDIOFILES.pop();
		}
		AUDIOFILES.push(url);
		loadBuffers();
		//$('#previewsource').attr('src', url).detach().appendTo("#audio");
		//audio.load();
	});
}

function submit() {
	console.log(currentBlob);
	var fd = new FormData();
	text = $("#sentence").text().trim();
	contributeid = makeid();
	fd.append('fname', contributeid + '.wav');
	fd.append('contributeid', contributeid);
	fd.append('audio', currentBlob);
	fd.append('requestid', requestid);
	fd.append('projectid', projectid);

	$.ajax({
		type: 'POST',
		url: '/upload',
		data: fd,
		processData: false,
		contentType: false
	}).done(function(data) {
		console.log(data);
		$("#turk").text(contributeid);
		$(".turk-code").modal('show');
	});
}

window.onload = function init() {
	$("#record").attr('disabled', 'true');
	$("#submit").attr('disabled', 'true');
	$("#preview").attr('disabled', 'true');
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = 	(navigator.getUserMedia ||
					   				navigator.webkitGetUserMedia ||
					   				navigator.mozGetUserMedia ||
					   				navigator.msGetUserMedia);
		window.URL = window.URL || window.webkitURL;

		context = new AudioContext;
		console.log('Audio context set up.');
		console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
		loadBuffers();
		} catch (e) {
		}

		navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
			console.log('No live audio input: ' + e);
		});
};

function loadBuffers() {
	bufferLoader = new BufferLoader (
		context,
		AUDIOFILES,
		finishedLoading
	);
	bufferLoader.load();

	function finishedLoading(bufferList) {
		BUFFERS = bufferList.slice(0);
	}
}

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}
