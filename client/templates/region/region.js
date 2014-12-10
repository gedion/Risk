Template.region.helpers({
/*    conqueror: function(){ 
		return 'GED';
	}*/
});


Template.region.events({
	"click #btnFire": function(e, template) {
		var _col = $("#txtCol").val();
		var _row = $("#txtRow").val();
		try {
			window.myBattleship.fire(Session.get("playerName"), _col, parseInt(_row, 10));
		} catch (err) {
			bootbox.alert("There was a problem firing: " + err.message);
		}
	}
});