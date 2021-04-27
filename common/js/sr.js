// -=-=-=-=-=-=- Speech to Text::

try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.continuous = true;
    listenNow();
} catch (e) {
    console.error(e);
}


function listenNow() {
    recognition.start();
}

function StopListening() {
    recognition.stop();
}


// This block is called every time the Speech APi captures a line. 
recognition.onresult = function (event) {

    //    console.log(event);
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;
    var confidence = event.results[current][0].confidence;

    //    document.transcript = transcript;


    if (transcript[0] == ' ') {
        transcript = transcript.slice(1);
        //        ParseSentance(transcript);
    } else {
        //        ParseSentance(transcript);
    }

    console.log('[' + (confidence * 100).toFixed(2) + '%][' + transcript + ']');


};

function DelayisTalkingFalse(sec = 1) {
    {

        if (sec > 2) {

        } else {
            sec *= 1000;
        }

        // THIS IS THE TURN OFF FLICKER
        setTimeout(function () {
            Al.isTalking = false;
        }, sec);
    }
}


recognition.onsoundstart = function () {
    console.log('Some sound is being received');
}

recognition.onstart = function () {
    console.log('[listening]');
}

recognition.onspeechend = function () {
    console.log('[sleeping]');
    setTimeout(listenNow, 1000);
}

recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        console.log('No speech was detected. Try again.');
        setTimeout(listenNow, 1000);
    };
}
