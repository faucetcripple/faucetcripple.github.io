var SR = { // -=-=-=-=-=-=- Speech Recognition in Object Form
    recognition: undefined,
    settings: {
        isVerbose: true,
    },
    log: function (msg) {
        if (SR.settings.isVerbose) {
            console.log(msg);
        }
    },
    listenNow: function () {
        SR.recognition.start();
    },
    stopListening: function () {
        SR.recognition.stop();
    },
    onResult: function (event) {
        var current = event.resultIndex;
        var transcript = event.results[current][0].transcript;
        var confidence = event.results[current][0].confidence;
        SR.log(`[${(confidence * 100).toFixed(2)}%][${transcript}]`);
        // you wanna send the data out to be processed here.
    },
    onSoundStart: function () {
        SR.log('Some sound is being received');
    },
    onStart: function () {
        SR.log('[listening]');
    },
    onSpeechEnd: function () {
        SR.log('[sleeping]');
        setTimeout(SR.listenNow, 1000);
    },
    onError: function (event) {
        if (event.error == 'no-speech') {
            SR.log('No speech was detected. Try again.');
            setTimeout(SR.listenNow, 1000);
        }
    },
    init: function () {
        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();
            recognition.continuous = true;
            // Required::
            recognition.onresult = SR.onResult;
            // Optional::
            recognition.onsoundstart = SR.onSoundStart;
            recognition.onstart = SR.onStart;
            recognition.onspeechend = SR.onSpeechEnd;
            recognition.onerror = SR.onError;
            SR.recognition = recognition;
            SR.listenNow();
            console.log('[SRON]');
        } catch (e) {
            SR.log(e);
        }
    },
} // d74g0n 2021

SR.init();
