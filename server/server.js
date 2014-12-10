Meteor.startup(function() {
	return Meteor.methods({
		reset : function() {
			var count = Map.remove({});
			return count;
		},
		createGame : function(config) {
			config = config || [];
			for (var i = 0,
			    l = config.length; i < l; i++) {
				Map.insert(config[i]);
			}
		}
	});
});
