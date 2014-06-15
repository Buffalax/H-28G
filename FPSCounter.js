function FPSCounter(aRefreshInterval) {
	var self = this;

	var time;
	var count;
	var modifier;
	var refreshInterval;

	this.update = function(aTime) {
		var diff = aTime - time;

		++count;
		if (diff > refreshInterval) {
			self.fps = count * modifier | 0;

			count = 0;
			time = aTime;
		}
	};

	this.setRefreshInterval = function(aRefreshInterval) {
		var now = +new Date();

		if (time) {
			// scale count according to time passed
			count /= (now - time) / refreshInterval;
			self.fps = (count * modifier) | 0;
		}

		// reset
		count = 0;
		time = now;
		refreshInterval = aRefreshInterval || 1000;
		modifier = 1000 / refreshInterval;
	};

	this.getRefreshInterval = function() {
		return refreshInterval;
	};

	// init
	this.setRefreshInterval();
}
