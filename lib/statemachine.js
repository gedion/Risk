
/**
 * Represents states that a player can take
 *

 * @class RiskFsm
 * @uses StateMachine //https://github.com/nate-strauser/meteor-statemachine
 * @constructor
 */
_riskFsm = function() {
		return StateMachine.create({			
			initial: 'stale',
			events: [ 
					{ name: 'play',  from: 'stale',  to: 'initReinforce' },
					{ name: 'play',  from: 'idle', to: 'reinforce'},
					{ name: 'wait', from: 'initReinforce', to: 'stale'},	
					{ name: 'completeInitReinforce', from: 'stale' ,to:'idle'},
					{ name: 'wait', from: 'postStrike', to: 'idle'},
					{ name: 'prepareForStrike', from: ['preStrike','idle'], to: 'preStrike'},
					{ name: 'wait', from: 'reinforce', to: 'idle'},
					{ name: 'attack', from: 'preStrike', to: 'strike'},
					{ name: 'fortify', from :'strike', to:'postStrike'}		
			],
			callbacks: {
				onplay: function(event, from, to, player, units) {
					
					if (units > 0) {
						var unitsWord = units == 1 ? "unit" : "units"; //for the grammar nazis
						console.log(player, ', select a territory to reinforce with additional units. You have ' + units + ' ' + unitsWord + ' left.');
					}
				},
				onwait: function(event, from, to, player) {
					console.log(player, ', please wait!');
				},
				onprepareForStrike: function(event, from, to, player, region) {
					if (region) {
						console.log(player, ', select a territory to attack from ', region, '.');
					} else {
						console.log(player, ', select a territory to attack from or press the Attacks Completed button.');
					}
				},
				onattack: function(event, from, to, player, regionx, regiony) {
					console.log(player, ' is attacking ', regionx, ' from ', regiony, '.');
				},
				onfortify: function(event, from, to, player) {
					console.log(player, ', select a territory to move spare troops from or press the fortificatoin completed button to end your turn.');
				}
			}
		});
	};
RiskFsm = _riskFsm;