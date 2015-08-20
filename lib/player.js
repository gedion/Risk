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
		"additionalTroops" : config['additionalTroops'],
		/**
		 * 
		 * @attribute stateMachine
		 * @type {Object}
		 * @default {}
		 */
		"stateMachine" : config['stateMachine'] || {},
		/**
		 * @attribute map 
		 * @type {Object}
		 * @
		 */
		"map" : config['map']
	};
};

//builds getters and setters	
['name', 'id', 'additionalTroops', 'stateMachine','map'].forEach(function(name) {
	var idfier = name.charAt(0).toUpperCase() + name.slice(1),
	    getter = 'get' + idfier,
	    setter = 'set' + idfier;
		
	Player.prototype[getter] = function() {
		return this._get(name);
	}
	Player.prototype[setter] = function(value) {
		return this._set(name, value);
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
	    map,
	    fsm = this.getStateMachine(),
	    playerName = this.getName(),
	    playersInitUnits = this.getAdditionalTroops() || 4;
	    
	map = this.getMap();
	regionsConfig = map.find({
		'conqueror' : playerName
	}).fetch();

	for (var j = playersInitUnits; j > 0; j--) {
		region = this.getRegion(regionsConfig);
		fsm.play(playerName, j);
		fsm.wait(playerName);
		this.setAdditionalTroops(--playersInitUnits);
		region.addTroops(1);
	}
};
/**
 * @method getRegion
 * @param {Array} regionConfig
 * @returns {Region} 
 */
Player.prototype.getRegion = function(regionConfig){
	return new Region(regionConfig[Math.floor(Math.random() * regionConfig.length)]);
}
/**
 * Fetches a property. Private. Use the getAttrName method instead.
 * @method _get
 * @private
 * @param key {string}
 * @param value {string}
 * @example
 *	this._get('name'); // returns Gedion
 */
Player.prototype._get = function(key) {
	return this._config[key];
}
/**
 * 
 * Updates a property. Private. Use the setAttrName methods instead.
 * @method set
 * @private
 * @param key {string}
 * @param value {string}
 * @example
 *	this._set('name','Gedion');
 */
Player.prototype._set = function(key, value) {
	return this._config[key] = value;
}
/**
 * JSON string representation of a player
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