module.exports = function(Meteor) {
	var _ = Meteor.underscore;
	var Tracker = Meteor.Tracker;


	function ReactiveObjectMap()
	{
		// called without `new`
		if (!(this instanceof ReactiveObjectMap))
			return new ReactiveObjectMap();

		var self = this


		this._map = {};
		this._dep = new Tracker.Dependency;


		function observer(changes)
		{
			console.log(changes)
			self._dep.changed();
		}

		function setMap(value)
		{
			if(Object.unobserve)
			{
				var map = this._map

				Object.keys(map).forEach(function(key)
				{
					Object.unobserve(map[key], observer)
				})
			}

			this._map = value
			this._dep.changed()
		}


		// Entries (globally)

		this.assign = function(collection, iteratee)
		{
			setMap(_.indexBy(collection, iteratee))

			if(Object.observe)
				collection.forEach(function(item)
				{
					Object.observe(item, observer)
				})
		};

		this.clear = setMap.bind(this, {})


		// Entries

		this.set = function(key, item) {
			if(this._map[key] !== item)
			{
				this._map[key] = item

				if(Object.observe)
					 Object.observe(item, observer)

				this._dep.changed()
			}
		};

		this.delete = function(key)
		{
			if(Object.unobserve)
				 Object.unobserve(this._map[key], observer)

			delete this._map[key]

			this._dep.changed()
		};
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


	// Entries

	ReactiveObjectMap.prototype.get = function(key) {
		if (Tracker.active) this._dep.depend();

		return this._map[key];
	};

	ReactiveObjectMap.prototype.has = function(key) {
		if (Tracker.active) this._dep.depend();

		return this.hasOwnProperty(key);
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
