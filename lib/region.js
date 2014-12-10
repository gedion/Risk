/**
 * Represents the contigious block of region that a player owns or can conquer.
 *
 * Can add/remove troops, update configs, collections and return json rep of region.
 * @class Region
 * @uses Map
 * @constructor
 * @param config{Object}
 * @example
 * 	//Regions config and attributes
 *	var config = {
 *		"id": 2,
 *		"troopsCount": 2,
 *		"conqueror": "Gedion",
 *		"label": "region 0"
 *	};
 *	region = new Region(config);
 *	region.toString(); // returns the json string representation of the object
 *	region.set('conqueror','Gedion'); //set the conqueror attribute of the config
 *	region.get('conqueror'); //returns Gedion
 *	region.addTroops(2); //reinforces additional troops to the region. Updates the Map collection, which induces Meteor's push notification for global update.
 * 	region.removeTroops(2); //removes trrops from the region. Also updates the Map collection.
 *
 */
Region = function(config) {
	config = config || {};

	this._config = {
		/**
		 * @attribute _id
		 * @readOnly
		 * @type {String}
		 * @default null
		 */
		"_id" : config["_id"],
		/**
		 * @attribute id
		 * @type {int}
		 * @default null
		 */
		"id" : config['id'],
		/**
		 * @attribute troopsCount
		 * @type {int}
		 * @default null
		 */
		"troopsCount" : config['troopsCount'],
		/**
		 * @attribute conqueror
		 * @type {string}
		 * @default null
		 */
		"conqueror" : config['conqueror'],
		/**
		 * @attribute label
		 * @type {string}
		 * @default null
		 */
		"label" : config['label']
	}
};
//builds getters and setters
['_id', 'id', 'troopsCount', 'conqueror', 'label'].forEach(function(name) {
	var idfier = name.charAt(0).toUpperCase() + name.slice(1),
	    getter = 'get' + idfier,
	    setter = 'set' + idfier;
	Region.prototype[getter] = function() {
		return this.get(name);
	}
	Region.prototype[setter] = function(value) {
		return this.set(name, value);
	}
});
/**
 * Reinforces additional troops to the region. Updates the Map collection, which induces Meteor's push notification for global update.
 * @method addTroops
 * @param numOfTroops {int}
 *
 */
Region.prototype.addTroops = function(numOfTroops) {
	this.setTroopsCount(this.getTroopsCount() + numOfTroops);
	Map.update({
		'_id' : this.get_id()
	}, this._config);
};
/**
 * Removes troops from the region. Updates the Map collection, which induces Meteor's push notification for global update.
 * @method removeTroops
 * @param numOfTroops {int}
 *
 */
Region.prototype.removeTroops = function(numOfTroops) {
	this.setTroopsCount(this.getTroopsCount() - numOfTroops);
	Map.update({
		'_id' : this.get_id()
	}, this._config);
};
/**
 * JSON string representation of the Region
 * @method toString
 * @return {String}
 * @example
 * 	{
 *		"_id": "kczjckciq7csYAWsF",
 *		"id": 2,
 *		"troopsCount": 2,
 *		"conqueror": "Computer 2",
 *		"label": "region 0"
 *	};
 */
Region.prototype.toString = function() {
	return JSON.stringify(this._config);
};
/**
 * Fetches a property
 * @method get
 * @param key {key}
 * @example
 *	region.get('conqueror'); //returns Gedion
 */
Region.prototype.get = function(key) {
	return this._config[key];
};
/**
 * Updates a property.
 * @method set
 * @param key {string}
 * @param value {string}
 * @example
 *	region.set('conqueror','Gedion');
 */
Region.prototype.set = function(key, value) {
	return this._config[key] = value;
}; 