module.exports = function(Meteor) {
	var _ = Meteor.underscore;
	var Tracker = Meteor.Tracker;
	var ReactiveObjectMap;

	ReactiveObjectMap = function(obj) {
		if (!(this instanceof ReactiveObjectMap))
			// called without `new`
			return new ReactiveObjectMap();

		this._map = _.assign({}, obj);
		this._dep = new Tracker.Dependency;
	};

	ReactiveObjectMap.prototype.assign = function(collection, iteratee) {
		this._map = _.indexBy(collection, iteratee);
		this._dep.changed();
	};

	ReactiveObjectMap.prototype.get = function(key) {
		if (Tracker.active)
			this._dep.depend();
		if (key)
			return this._map[key];
		else
			return this._map;
	};

	ReactiveObjectMap.prototype.set = function(key, value) {
		var old = this._map[key];
		this._map[key] = value;
		if (old !== value)
			this._dep.changed();
	};

	ReactiveObjectMap.prototype.has = function(key) {
		if (Tracker.active)
			this._dep.depend();
		return this._map.hasOwnProperty(key);
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
		this._map[key][attr] = value;
		if (old !== value)
			this._dep.changed();
	};

	ReactiveObjectMap.prototype.getAttribute = function(key, attr) {
		if (Tracker.active)
			this._dep.depend();
		return this._map[key][attr];
	};

	ReactiveObjectMap.prototype.keys = function() {
		if (Tracker.active)
			this._dep.depend();
		return Object.keys(this._map);
	};

	ReactiveObjectMap.prototype.values = function() {
		if (Tracker.active)
			this._dep.depend();
		return _.values(this._map);
	};

	ReactiveObjectMap.prototype.filter = function(predicate) {
		if (Tracker.active)
			this._dep.depend();
		return _.filter(this._map,predicate);
	};

	ReactiveObjectMap.prototype.sortBy = function(iteratee) {
		if (Tracker.active)
			this._dep.depend();
		return _.sortBy(this._map,iteratee);
	};

	ReactiveObjectMap.prototype.map = function(iteratee) {
		if (Tracker.active)
			this._dep.depend();
		return _.map(this._map,iteratee);
	};

	ReactiveObjectMap.prototype.size = function() {
		if (Tracker.active)
			this._dep.depend();
		return Object.keys(this._map).length;
	};

	ReactiveObjectMap.prototype.toString = function() {
		return 'ReactiveObjectMap{' + this.get() + '}';
	};

	ReactiveObjectMap.prototype._numListeners = function() {
		// Tests want to know.
		// Accesses a private field of Tracker.Dependency.
		var count = 0;
		for (var id in this._dep._dependentsById)
			count++;
		return count;
	};

	Meteor.ReactiveObjectMap = ReactiveObjectMap;

	module.exports = ReactiveObjectMap;
};
