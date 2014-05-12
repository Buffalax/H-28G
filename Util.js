var Util = (function() {
	var PI2 = Math.PI * 2;

	return {
		PI2: PI2,

		singleRun: function(aFunction) {
			var started = false;

			return function() {
				if (!started) {
					started = true;
					return aFunction.apply(this, arguments);
				}
			};
		},

		noop: function() {
		},

		degToRad: function(aDegrees) {
			return aDegrees * Math.PI / 180;
		},

		normalizeAngle: function(aAngle) {
			while (aAngle < 0) {
				aAngle += PI2;
			}

			return aAngle % PI2;
		},

		normalizeAngleSimple: function(aAngle) {
			if (aAngle < 0) {
				return aAngle + PI2;
			}

			return (aAngle > PI2) ? (aAngle - PI2) : aAngle;
		},

		clamp: function(aX, aMin, aMax) {
			return Math.min(aMax, Math.max(aMin, aX));
		},

		sign: function(x) {
			return (0 < x) - (x < 0);
		}
	};
})();
