$('document').ready(function(){

	setTimeout(function(){
		$(".loading").remove();
	}, 6200);

  $(".EXHIBITTEXT, .curtain").click(function() {
     $(".ARTIST").toggle("slow");
  }, );

});
