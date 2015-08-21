var DEFAULT_NUM_OF_INIT_TROOPS = 3;
var players = [{
        name: 'Computer 1',
        id: 1,
        additionalTroops:DEFAULT_NUM_OF_INIT_TROOPS,
        color: 'yellow'
    }, {
        name: 'Computer 2',
        id: 2,
        additionalTroops:DEFAULT_NUM_OF_INIT_TROOPS,
        color: 'blue'
    }/*, {
        name: 'Computer 3',
        id: 3,
        additionalTroops:DEFAULT_NUM_OF_INIT_TROOPS
    }, {
        name: 'Computer 4',
        id: 4,
        additionalTroops:DEFAULT_NUM_OF_INIT_TROOPS
    }, {
        name: 'Computer 5',
        id: 5,
        additionalTroops:DEFAULT_NUM_OF_INIT_TROOPS
    }*/];
myRisk = new Risk({
	players:players
});
myRisk.init();



