module.exports = function(Meteor) {
	var _ = Meteor.underscore;
	var Tracker = Meteor.Tracker;


	function ReactiveObjectMap() {
		// called without `new`
		if (!(this instanceof ReactiveObjectMap))
			return new ReactiveObjectMap();

		this._map = {};
		this._dep = new Tracker.Dependency;
	};

	ReactiveObjectMap.prototype.assign = function(collection, iteratee) {
		this._map = _.indexBy(collection, iteratee);
		this._dep.changed();
	};

	ReactiveObjectMap.prototype.get = function(key) {
		if (Tracker.active)
			this._dep.depend();
		return this._map[key];
	};

	ReactiveObjectMap.prototype.set = function(key, value) {
		var old = this._map[key];
		if (old !== value)
		{
			this._map[key] = value;
			this._dep.changed();
		}
	};

	ReactiveObjectMap.prototype.has = function(key) {
		if (Tracker.active)
			this._dep.depend();
		return this.hasOwnProperty(key);
	};

	ReactiveObjectMap.prototype.clear = function(key, value) {
		this._map = {};
		this._dep.changed();
	};

	ReactiveObjectMap.prototype.delete = function(key, value) {
		if (delete this._map[key])
			this._dep.changed();
	};


	ReactiveObjectMap.prototype.setAttribute = function(key, attr, value) {
		var old = this._map[key][attr];
		if (old !== value)
		{
			this._map[key][attr] = value;
			this._dep.changed();
		}
	};

	ReactiveObjectMap.prototype.getAttribute = function(key, attr) {
		return this.get(key)[attr];
	};


	['keys', 'values', 'filter', 'sortBy', 'map'].forEach(function(methodName)
	{
		ReactiveObjectMap.prototype[methodName] = function(value) {
			if (Tracker.active)
				this._dep.depend();
			return _[methodName](this._map, value);
		};
	})

	ReactiveObjectMap.prototype.size = function() {
		return this.keys().length;
	};

	ReactiveObjectMap.prototype.toString = function() {
		return 'ReactiveObjectMap{' + this.get() + '}';
	};

	ReactiveObjectMap.prototype._numListeners = function() {
		// Tests want to know.
		// Accesses a private field of Tracker.Dependency.
		return Object.keys(this._dep._dependentsById).length
	};


	module.exports = Meteor.ReactiveObjectMap = ReactiveObjectMap;
};
