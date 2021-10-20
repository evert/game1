var Sound = function (options) {
	this.looping = true;

	for(item in options) {
		this[item] = options[item];
	}

	this.init();
}

Sound.prototype = {
	AudioContext : window.AudioContext || window.webkitAudioContext,
	audioCtx: null,
	sourceBuffer: null,
	gainNode: null,

	init: function () {
		this.audioCtx = new this.AudioContext();
		this.gainNode = this.audioCtx.createGain();
		this.gainNode.gain.value = 0.25;
		this.gainNode.connect(this.audioCtx.destination);
		this.sourceBuffer = this.audioCtx.createBufferSource();
		this.getSound();

		var checkbox = document.querySelector('input[type=checkbox]');
		checkbox.onclick = function (event) {
			if(event.target.checked) {
				this.stopSound();
			} else {
				this.init();
			}
		}.bind(this)
	},

	getSound: function () {

		var url = this.sound;
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = 'arraybuffer';

		request.onload = function () {

			var undecodedAudio = request.response;
			this.audioCtx.decodeAudioData(undecodedAudio, function (buffer) {

			// Tell the AudioBufferSourceNode to use this AudioBuffer.
			this.sourceBuffer.buffer = buffer;
			// this.sourceBuffer.connect(this.audioCtx.destination);
			this.sourceBuffer.connect(this.gainNode);
			this.sourceBuffer.loop = this.looping;
			this.sourceBuffer.playbackRate.value = 1;
			this.sourceBuffer.start(this.audioCtx.currentTime);
			}.bind(this));
		}.bind(this);

		request.send();
	},

	updateGain: function (level) {
		this.gainNode.gain.value = level;
	},

	toggleLoop: function(looping) {
		this.sourceBuffer.loop = looping;
	},

	updateEngine: function (speed) {

		var f = speed < 0.01 ? 0.30 :
			speed < 8 ? 0.30 + speed / 10 :
			speed < 15 ? 0.30 + speed / 20 :
			speed < 27.5 ? 0.20 + speed / 40 : 
			speed < 40 ? 0.20 + speed / 45 : 
			0.20 + speed / 50;

		this.gainNode.gain.value = 0.1 + speed / 50 //(maxspeed = 50)
		this.sourceBuffer.connect(this.gainNode);
		this.sourceBuffer.playbackRate.value = f
		// var C = 15;
		// this.sourceBuffer.playbackRate.value = 0.35 + (speed/C - Math.floor(speed / C));
	},

	stopSound: function () {
		this.sourceBuffer.stop();
	}

}
