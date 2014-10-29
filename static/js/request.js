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


$(document).ready(function() {
	$('#submitButton').click(function(e) {
		text = $('#inputBox').val();
		// throw error if no text entered
		if (text.length === 0) {
			alert('Please enter text before submitting.');
		} else {
			// send POST request of string to server
			data = new FormData();
			requestID = makeID();
			data.append('requestid', requestID);
			data.append('string', text);
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
			// $.post('/createRequest', data, function(data) {
			// 	console.log(data + ' posted!');
			// });
		}
	});
});