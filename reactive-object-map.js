module.exports = function(Meteor) {
	var _ = Meteor.underscore;
	var Tracker = Meteor.Tracker;


	function observer()
	{
		this._dep.changed();
	}


	function ReactiveObjectMap() {
		// called without `new`
		if (!(this instanceof ReactiveObjectMap))
			return new ReactiveObjectMap();

		this._map = {};
		Object.observe(this._map, observer)

		this._dep = new Tracker.Dependency;
	};


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


	// Entries (globally)

	function setMap(value)
	{
		var map = this._map
		Object.keys(map).forEach(function(key)
		{
			Object.unobserve(map[key], observer)
		}, this)
		Object.unobserve(map, observer)

		this._map = value
		Object.observe(value, observer)

		this._dep.changed()
	}

	ReactiveObjectMap.prototype.assign = function(collection, iteratee)
	{
		setMap(_.indexBy(collection, iteratee))

		collection.forEach(function(item)
		{
			Object.observe(item, observer);
		})
	};

	ReactiveObjectMap.prototype.clear = function()
	{
		setMap({})
	};


	// Entries

	ReactiveObjectMap.prototype.set = function(key, item) {
		if(this._map[key] !== item)
		{
			this._map[key] = item

			Object.observe(item, observer)
		}
	};

	ReactiveObjectMap.prototype.get = function(key) {
		if (Tracker.active) this._dep.depend();

		return this._map[key];
	};

	ReactiveObjectMap.prototype.has = function(key) {
		if (Tracker.active) this._dep.depend();

		return this.hasOwnProperty(key);
	};

	ReactiveObjectMap.prototype.delete = function(key)
	{
		Object.unobserve(this._map[key], observer);

		delete this._map[key]
	};


	// Entries attributes

	ReactiveObjectMap.prototype.setAttribute = function(key, attr, value) {
		var item = this._map[key]
		if(item[attr] !== value)
			 item[attr] = value
	};

	ReactiveObjectMap.prototype.getAttribute = function(key, attr) {
		return this.get(key)[attr];
	};


	// Access functions

	['keys', 'values', 'filter', 'sortBy', 'map'].forEach(function(methodName)
	{
		ReactiveObjectMap.prototype[methodName] = function(value) {
			if (Tracker.active) this._dep.depend();

			return _[methodName](this._map, value);
		};
	})


	module.exports = Meteor.ReactiveObjectMap = ReactiveObjectMap;
};
