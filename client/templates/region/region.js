Template.region.events({
    "click button.reinforce": function(e, template) {
        var r = Map.find({
            _id: template.data._id
        }).fetch()[0];
        r.reinforceCount = r.reinforceCount - 1;
        var region = new Region(r);
        region.addTroops(1);
        var player = myRisk.getCurrentPlayer();
        player.updateReinforcedTroopsCount(r.reinforceCount);
        player.setAdditionalTroops(player.getAdditionalTroops() - 1);
    },
    "click button.attack": function(e, template) {
        var r = Map.find({
            _id: template.data._id
        }).fetch()[0];
        var region = new Region(r);
        var randNum = Math.floor(Math.random() * 2) + 1;

        if(randNum == Math.floor(Math.random() * 2) + 1){
            var player = myRisk.getCurrentPlayer();
            region.updateConquerer(player.getName(), player.getId(), player.getColor());
            console.log('You win!');
        }else{
            console.log('You lose!');
        }
       // {_id: "PzBme3ZdWYKC4mJWC", id: 2, troopsCount: 1, conqueror: "Computer 2", label: "region 10"…}
    }
});

Template.registerHelper('hasAdditionalTroops', function() {
    if (this.reinforceCount > 0) {
        return true;
    }
});

Template.registerHelper('isAttackableEnemyRegion', function() {
    var sm,
        player = myRisk.getCurrentPlayer();
    if(!player){
        return false;
    }
    sm = player.getStateMachine();
    if (sm.current == 'preStrike' && this.reinforceCount == undefined && player.getName() != this.conqueror) {
        return true;
    }
});
