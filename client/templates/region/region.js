Template.region.helpers({
    reinforceCount: function(){
        debugger;
		return this.reinforceCount;
	}
});


Template.region.events({
	"click button": function(e, template) {
		try {
            debugger;
            r = Map.find({_id:template.data._id}).fetch()[0];
            r.reinforceCount = r.reinforceCount - 1;
            var region = new Region(r);
            region.addTroops(1);
            var player = myRisk.getPlayers()[myRisk.getTurn()];
            var regions = myRisk.getRegions();
            for(var i = 0; i<regions.length;i++){
                var region = regions[i];
                console.log('r count ' , r.reinforceCount);
                region.addReinforcedTroopsCount(r.reinforceCount);
            }
            player.setAdditionalTroops(player.getAdditionalTroops() - 1);
		} catch (err) {
		}
	}
});
