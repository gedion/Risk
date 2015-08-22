Template.region.events({
	"click button": function(e, template) {
		try {
            r = Map.find({_id:template.data._id}).fetch()[0];
            r.reinforceCount = r.reinforceCount - 1;
            var region = new Region(r);
            region.addTroops(1);
            var player = myRisk.getCurrentPlayer();
            player.updateReinforcedTroopsCount(r.reinforceCount);
            player.setAdditionalTroops(player.getAdditionalTroops() - 1);
            player.updateState();
		} catch (err) {
		}
	}
});

Template.registerHelper('hasAdditionalTroops', function() {
    if(this.reinforceCount > 0) {
        return true;
    }
});

Template.registerHelper('isAttackableEnemyRegion', function() {
    var player = myRisk.getCurrentPlayer(),
        sm = player.getStateMachine();
    if(sm.currnet == 'preStrike' && this.reinforceCount == undefined && player.getName() != this.conqueror) {
        return true;
    }
});
