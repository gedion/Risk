/**
 * Represents a player for the game of Risk.
 *
 * @class Player
 * @uses RiskFsm, Map
 * @constructor
 * @param config{Object}
 * @example
 * 	//Player config and attributes
 *	var config = {
 *   	"name": "Computer 1",
 *   	"id": 1
 *	}
 *	player = new Player(config);
 *	region.toString(); // returns the json string representation of the object
 *
 */
Player = function(config) {
	config = config || {};
	this._config = {
		/**
		 * @attribute name
		 * @type {String}
		 * @default null
		 */
		"name" : config['name'],
		/**
		 * @attribute id
		 * @type {String}
		 * @default null
		 */
		"id" : config['id'],
		/**
		 * @attribute additionalTroops
		 * @type {int}
		 * @default null
		 */
		"additionalTroops" : null,
		/**
		 * Read only
		 * @attribute stateMachine
		 * @readOnly
		 * @type {object}
		 * @default {}
		 */
		"stateMachine" : config['stateMachine'] || {}
	};
};
//builds getters and setters
['name', 'id', 'additionalTroops', 'stateMachine'].forEach(function(name) {
	var idfier = name.charAt(0).toUpperCase() + name.slice(1),
	    getter = 'get' + idfier,
	    setter = 'set' + idfier;
	Player.prototype[getter] = function() {
		return this.get(name);
	}
	Player.prototype[setter] = function(value) {
		return this.set(name, value);
	}
});

/**
 *
 * @method play
 *
 */
Player.prototype.play = function() {
	var fsm = this.getStateMachine(),
	    playerName = this.getName();

	this.reinforceTroops();
	fsm.prepareForStrike(playerName);
	//if self region
	fsm.prepareForStrike(playerName, 'region');
	//if enemy regions attack
	fsm.attack(playerName, 'regionx', 'regiony');
	fsm.fortify(playerName);
	fsm.wait(playerName);
};
/**
 *
 * @method initReinforce
 *
 */
Player.prototype.initReinforce = function() {
	var playerName = this.getName(),
	    playersInitUnits = this.getAdditionalTroops() || 4,
	    fsm = this.getStateMachine();
	fsm.play(playerName, playersInitUnits);
	fsm.wait(playerName);
	this.setAdditionalTroops(--playersInitUnits);
	if (playersInitUnits == 0) {
		fsm.completeInitReinforce();
	}
};

/**
 *
 * @method reinforceTroops
 *
 */
Player.prototype.reinforceTroops = function() {
	var region,
	    regionConfig,
	    numOfRegions,
	    fsm = this.getStateMachine(),
	    playerName = this.getName(),
	    playersInitUnits = this.getAdditionalTroops() || 4;

	regionConfig = Map.find({
		'conqueror' : playerName
	}).fetch();
	numOfRegions = regionConfig.length;
	for (var j = playersInitUnits; j > 0; j--) {
		region = new Region(regionConfig[Math.floor(Math.random() * numOfRegions)]);
		fsm.play(playerName, j);
		fsm.wait(playerName);
		this.setAdditionalTroops(--playersInitUnits);
		region.addTroops(1);
	}
};
/**
 * Updates a property.
 * @method get
 * @param key {string}
 * @param value {string}
 * @example
 *	player.get('name'); // returns Gedion
 */
Player.prototype.get = function(key) {
	return this._config[key];
}
/**
 * Updates a property.
 * @method set
 * @param key {string}
 * @param value {string}
 * @example
 *	player.set('name','Gedion');
 */
Player.prototype.set = function(key, value) {
	return this._config[key] = value;
}
/**
 * JSON string representation of a players
 * @method toString
 * @return {String}
 * @example
 * 	{
 * 	"name": "Computer 1",
 * 		"id": 1,
 * 		"additionalTroops": 3,
 * 		"stateMachine": {
 * 		"current": "idle",
 * 			"transition": null
 * 		}
 * 	}
 */
Player.prototype.toString = function() {
	return JSON.stringify(this._config);
}