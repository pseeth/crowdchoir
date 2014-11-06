// POST request to server to send string
var text, data, requestID;

// function to generate 10 letter random string
var makeID = function() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
	return text;
};

var requestID;

$(document).ready(function() {
	if ($.cookie('projectid') == undefined) {
		$.cookie('projectid', makeID(), {expires : 1, path: '/'})
	}
	Dropzone.options.audio = {
		paramName:  'audio',
		maxFilesize: 4,
		sending: function(file, xhr, data) {
			requestID = makeID();
			data.append('requestid', requestID);
			data.append('fname', requestID + '.wav');
			data.append('projectid', $.cookie('projectid'));
		}
	};
});

function submit() {
	window.location.replace("/projects/" + $.cookie('projectid'));
}

function newproject() {
	$.removeCookie('projectid');
	window.location.replace("/request");
}
/*
function submit() {
	text = $('#inputBox').val();
	// throw error if no text entered
	if (text.length === 0) {
		alert('Please enter text before submitting.');
	} else {
		// send POST request of string to server
		data = new FormData();
		$.ajax({
			url: '/createRequest',
			type: 'POST',
			data: data,
			success: function(data) {
				console.log(data + 'POSTED!');
			},
			processData: false,
			contentType: false
		});
}*/
