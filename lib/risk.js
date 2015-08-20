var DEFAULT_NUM_OF_INIT_TROOPS = 4,
    DEFAULT_NUM_OF_REGIONS = 12;
/**
 * Represents a game of Risk
 *
 * @class Risk
 * @uses Player, Map, RiskFsm, and Region
 * @constructor
 * @param config{Object}
 * @example
 *	risk = new Risk();
 *	risk.init(); // set up init;
 *	risk.play(); //start game;
 *
 */
Risk = function(config) {
	config = config || {};

	this._config = {
		/**
		 * @attribute players
		 * @type {Array}
		 * @default null
		 */
		players : config['players'],
		/**
		 * @attribute regions
		 * @type {Array}
		 * @default null
		 */
		regions : config['regions'],
		/**
		 * @attribute turn
		 * @type {int}
		 * @default null
		 */
		turn : config['turn'],
		/**
		 * @attribute numOfRegions
		 * @type {int}
		 * @default 12
		 */
		numOfRegions : config['numOfRegions'] || DEFAULT_NUM_OF_REGIONS
	}
};
//builds getters and setters
['players', 'regions', 'turn', 'numOfRegions'].forEach(function(name) {
	var idfier = name.charAt(0).toUpperCase() + name.slice(1),
	    getter = 'get' + idfier,
	    setter = 'set' + idfier;
	Risk.prototype[getter] = function() {
		return this.get(name);
	}
	Risk.prototype[setter] = function(value) {
		return this.set(name, value);
	}
});
//players,regins,turn
//
/**
 * Init configs. sets up Player, Region, Collection and StateMachine objects
 * must have at least one player
 * @method init
 */
Risk.prototype.init = function() {
	var id,
	    player,
	    players,
	    regions = [],
	    regionAllotedToPlayer,
	    numOfRegions = this.getNumOfRegions();
	this.setPlayers(this.createPlayers(this.getPlayers()));

	players = this.getPlayers();
	this.setTurn(-1);
	Meteor.call('reset');
	for (var i = 0; i < numOfRegions; i++) {
		regionAllotedToPlayer = Math.floor(Math.random() * players.length);
		player = players[regionAllotedToPlayer];
		id = player.getId();
		regions.push({
			'id' : id,
			'troopsCount' : 1,
			'conqueror' : player.getName(),
			'label' : 'region ' + i
		});
	}
	Meteor.call('createGame', regions);
	this.setRegions(this.createRegions(regions));
	for (var i = 0,
	    l = players.length; i < l; i++) {
		players[i].setStateMachine(new RiskFsm());
	}
	this.initReinforceTroops();
};
/**
 * Builds the players and returns array of Players
 * @method createPlayers
 * @param regionsConfig {Object}
 * @returns {Array}
 */
Risk.prototype.createPlayers = function(playersConfig) {
	var players = [{
		name : 'Computer 1',
		id : 1,
		additionalTroops : DEFAULT_NUM_OF_INIT_TROOPS
	}, {
		name : 'Computer 2',
		id : 2,
		additionalTroops : DEFAULT_NUM_OF_INIT_TROOPS
	}, {
		name : 'Computer 3',
		id : 3,
		additionalTroops : DEFAULT_NUM_OF_INIT_TROOPS
	}, {
		name : 'Computer 4',
		id : 4,
		additionalTroops : DEFAULT_NUM_OF_INIT_TROOPS
	}, {
		name : 'Computer 5',
		id : 5,
		additionalTroops : DEFAULT_NUM_OF_INIT_TROOPS
	}];
	var _config = [];
	playersConfig = playersConfig || players;
	for (var i = 0,
	    l = playersConfig.length; i < l; i++) {
	    	playersConfig[i]['map'] = Map;	
		_config.push(new Player(playersConfig[i]));
	}
	return _config;
}
/**
 * Builds the map and returns array of Regions.
 * @method createRegions
 * @param regionsConfig {Object}
 * @returns {Array}
 */
Risk.prototype.createRegions = function(regionsConfig) {
	var _config = [];
	regionsConfig = regionsConfig || [];
	for (var i = 0,
	    l = regionsConfig.length; i < l; i++) {
		_config.push(new Region(regionsConfig[i]));
	}
	return _config;
}
/**
 * prepares a user to take an action
 * @method play
 */
Risk.prototype.play = function() {
	var turnIndex = this.getNextPlayer(),
	    player = this.getPlayers()[turnIndex];
	player.play();
};
/**
 * Initial call to distribute troops
 * @method initReinforceTroops
 */
Risk.prototype.initReinforceTroops = function() {
	var playersInitUnits = DEFAULT_NUM_OF_INIT_TROOPS,
	    players = this.getPlayers();

	for (var j = playersInitUnits; j > 0; j--) {
		for (var i = 0,
		    l = players.length; i < l; i++) {
			players[i].initReinforce();
		}
	}
};
/**
 * sets and returns next player's index.
 * @method getNextPlayer
 * @returns {int}
 */
Risk.prototype.getNextPlayer = function() {
	var numOfPlayers = this.getPlayers().length,
	    turn = this.getTurn();
	if (turn >= numOfPlayers - 1) {
		turn = 0;
	} else {
		turn++;
	}
	this.setTurn(turn);
	return turn;
}
/**
 *
 * Invokes a game action
 * @method fire
 * @param playerName {String}
 * @param regionLabel {String}
 */
Risk.prototype.fire = function(playerName, regionLabel) {
	var regionCollection = Map.find({
		'label' : regionLabel
	}),
	    region = new Region(regionCollection.fetch()[0]),
	    conqueror = region.getConqueror(),
	    players = this.getPlayers(),
	    player = this.getPlayerByName(playerName);
	player.play(region);
};
/**
 * Given a player's name, it returns the corresponding Player Object
 * @method getPlayerByName
 * @param playerName {String}
 * @return {String}
 */
Risk.prototype.getPlayerByName = function(playerName) {
	var player,
	    players = this.getPlayers();

	for (var i = 0,
	    l = players.length; i < l; i++) {
		if (players[i].getName() == playerName) {
			player = players[i];
			break;
		}
	}
	return player;
};

/**
 *
 * @method toString
 * @return {String}
 *
 */
Risk.prototype.toString = function() {
	return "Risk Axum";
};
/**
 * fetches a property.
 * @method get
 * @param key {string}
 * @returns {Object}
 * @example
 *	risk.getPlayers(); //returns array of Players object
 */
Risk.prototype.get = function(key) {
	return this._config[key];
};
/**
 * Updates a property.
 * @method set
 * @param key {string}
 * @param value {Object}
 * @example
 *	risk.set('turn',1);  //sets player 1 as next turn
 */
Risk.prototype.set = function(key, value) {
	this._config[key] = value;
}