
Template.regionsList.helpers({
    regions: function(){
		return Map.find().map(
            function(doc,index){
                doc.index = index;
                return doc;
            }
        );
	}
});

