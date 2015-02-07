module.exports = function(Meteor) {
	var _ = Meteor.underscore;
	var Tracker = Meteor.Tracker;
	var ReactiveObjectMap;

	/**
	 * @class
	 * @instanceName reactiveVar
	 * @summary Constructor for a ReactiveObjectMap, which represents a reactive map of objects.
	 * Creates an object composed of keys generated from the results of running each element of collection through iteratee. The corresponding value of each key is the last element responsible for generating the key. The iteratee function is bound to thisArg and invoked with three arguments; (value, index|key, collection).

	collection (Array|Object|string): The collection to iterate over.
	[iteratee=_.identity] (Function|Object|string): The function invoked per iteration. If a property name or object is provided it is used to create a ".property" or ".matches" style callback respectively.
	[thisArg] (*): The this binding of iteratee.
	 * @locus Client
	 * @param {(Array|Object|string} collection The initial value to to iterate over
	 * @param {Function|Object|string} [iteratee=_.identity] Optional. The function invoked per iteration. If a property name or object is provided it is used to create a ".property" or ".matches" style callback respectively.
	 */
	ReactiveObjectMap = function(collection, iteratee) {
		if (!(this instanceof ReactiveObjectMap))
		// called without `new`
			return new ReactiveObjectMap(collection, iteratee);

		this.map = _.indexBy(collection, iteratee);
		this.dep = new Tracker.Dependency;
	};

	ReactiveObjectMap.prototype.get = function(key) {
		if (Tracker.active)
			this.dep.depend();

		return this.map[key];
	};

	ReactiveObjectMap.prototype.set = function(key, value) {
		var old = this.map[key];
		this.map[key] = value;
		if (old === value)
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
		if (old === value)
			this.dep.changed();
	};

	ReactiveObjectMap.prototype.getAttribute = function(key, attr) {
		this.map[key][attr] = value;
		this.dep.changed();
	};

	ReactiveObjectMap.prototype.keys = function() {
		if (Tracker.active)
			this.dep.depend();
		return Object.keys(map);
	};

	ReactiveObjectMap.prototype.values = function() {
		if (Tracker.active)
			this.dep.depend();
		return _.values(map);
	};

	ReactiveObjectMap.prototype.size = function() {
		if (Tracker.active)
			this.dep.depend();
		return Object.keys(map).length;
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
