recording = false;
var audio_context;
var recorder;
var gain;
var currentAudio;
var currentBlob;
var latitude;
var longitude;

function record() {
	recording = !recording;
	if (recording) {
		$("#record").html('<span class="glyphicon glyphicon-stop"></span> Stop');
		recorder && recorder.record();
	}
	else {
		$("#record").html('<span class="glyphicon glyphicon-record"></span> Record');
		recorder && recorder.stop();
		createDownloadLink();
		recorder.clear();
		$("#submit").attr('disabled', false);
	}
}

function startUserMedia(stream) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var input = audio_context.createMediaStreamSource(stream);
		console.log('Media stream created.' );
		console.log("input sample rate " +input.context.sampleRate);

		gain = audio_context.createGain();
		input.connect(gain);
		console.log('Input connected to dummy gain.');

		recorder = new Recorder(input);
		console.log('Recorder initialised.');
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		$("#record").attr('disabled', false);
	}, function() {
		return 0;
	});
}


function createDownloadLink() {
	recorder && recorder.exportWAV(function(blob) {
    	var url = (window.URL || window.webkitURL).createObjectURL(blob);
		currentAudio = url;
		currentBlob = blob;
		$('#previewsource').attr('src', url).detach().appendTo("#audio");
		audio.load();
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
	fd.append('text', text);
	fd.append('requestid', requestid);
	fd.append('longitude', longitude.toString());
	fd.append('latitude', latitude.toString());

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
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = 	(navigator.getUserMedia ||
					   				navigator.webkitGetUserMedia ||
					   				navigator.mozGetUserMedia ||
					   				navigator.msGetUserMedia);
		window.URL = window.URL || window.webkitURL;

		audio_context = new AudioContext;
		console.log('Audio context set up.');
		console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
		} catch (e) {
		}

		navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
			console.log('No live audio input: ' + e);
		});
};

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}
