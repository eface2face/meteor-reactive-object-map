module.exports = function(Meteor) {
	var _ = Meteor.underscore;
	var Tracker = Meteor.Tracker;
	var ReactiveObjectMap;

	ReactiveObjectMap = function() {
		if (!(this instanceof ReactiveObjectMap))
		// called without `new`
			return new ReactiveObjectMap();

		this.map = {};
		this.dep = new Tracker.Dependency;
	};

	ReactiveObjectMap.prototype.assign = function(collection, iteratee) {
		this.map = _.indexBy(collection, iteratee);
		this.dep.changed();
	};

	ReactiveObjectMap.prototype.get = function(key) {
		if (Tracker.active)
			this.dep.depend();
		return this.map[key];
	};

	ReactiveObjectMap.prototype.set = function(key, value) {
		var old = this.map[key];
		this.map[key] = value;
		if (old !== value)
			this.dep.changed();
	};

	ReactiveObjectMap.prototype.has = function(key) {
		if (Tracker.active)
			this.dep.depend();
		return this.hasOwnProperty(key);
	};

	ReactiveObjectMap.prototype.clear = function(key, value) {
		this.map = {};
		this.dep.changed();
	};

	ReactiveObjectMap.prototype.delete = function(key, value) {
		if (delete this.map[key])
			this.dep.changed();
	};


	ReactiveObjectMap.prototype.setAttribute = function(key, attr, value) {
		var old = this.map[key][attr];
		this.map[key][attr] = value;
		if (old !== value)
			this.dep.changed();
	};

	ReactiveObjectMap.prototype.getAttribute = function(key, attr) {
		if (Tracker.active)
			this.dep.depend();
		return this.map[key][attr];
	};

	ReactiveObjectMap.prototype.keys = function() {
		if (Tracker.active)
			this.dep.depend();
		return Object.keys(this.map);
	};

	ReactiveObjectMap.prototype.values = function() {
		if (Tracker.active)
			this.dep.depend();
		return _.values(this.map);
	};

	ReactiveObjectMap.prototype.size = function() {
		if (Tracker.active)
			this.dep.depend();
		return Object.keys(this.map).length;
	};

	ReactiveObjectMap.prototype.toString = function() {
		return 'ReactiveObjectMap{' + this.get() + '}';
	};

	ReactiveObjectMap.prototype._numListeners = function() {
		// Tests want to know.
		// Accesses a private field of Tracker.Dependency.
		var count = 0;
		for (var id in this.dep._dependentsById)
			count++;
		return count;
	};

	Meteor.ReactiveObjectMap = ReactiveObjectMap;

	module.exports = ReactiveObjectMap;
};
