$("#scrape").on("click", function(){
	$.ajax({
		method: "GET",
		url: "/scrape",
	}).done(function(data){
		console.log(data)
		window.location = "/"
	})
});

$(".navbar-nav li").click(function(){
	$(".navbar-nav li").removeClass("active");
	$(this).addClass("active");
});

$(".delete").on("click", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		mehtod:"POST",
		url: "/articles/delete/" + thisId
	}).done(function(data){
		window.location = "/saved"
	})
});

$(".saveNote").on("click", function(){
	var thisId = $(this).attr("data-id");
	if(!$("#noteText" + thisId).val()) {
		alert("please enter a note to save")
	} else {
		$.ajax({
			method: "POST",
			url: "/notes.save/" + thisId,
			data:{
				text: $("#noteText" + thisId).val()
			}
		}).done(function(data){
			console.log(data)
				$("#noteText" + thisId).val("");
				$(".modalNote").modal("hide");
				window.location = "/saved"
			
		});
	}
});

$(".deleteNote").on("Click", function(){
	var noteId = $(this).attr("data-note-id");
	var artcileId = $(this).attr("data-article-id");
	$.ajax({
		mehtod: "DELETE",
		url: "/notes/delete/" + noteId + "/" + articleId
	}).done(function(data){
		console.log(data)
		$(".modalNote").modal("hide");
		window.location = "/saved"
	})
});

// // ARTICLE to JSON //
// $.getJSON('/articles', function (data) {

//   for (var i = 0; i < data.length; i++) {

//     // PAGE DISPLAY //
//     $('#articles').append('<p data-id="' + data[i]._id + '">' + data[i].title + '<br />' + data[i].link + '</p>');
//   }
// });

// $(document).on('click', 'a', function () {
//     // EMPTY NOTE //
//   $('#notes').empty();

//   var thisId = $(this).attr('data-id');

//     // AJAX CALL for ARTICLE //
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId,
//   })
//   .done(function( data ) {
//     console.log(data);

//     $('#notes').append('<h2>' + data.title + '</h2>');
//     $('#notes').append('<input id="titleinput" name="title" >'); 
//     $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
//     $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
  
//     if(data.note){
//       $('#titleinput').val(data.note.title);
//       $('#bodyinput').val(data.note.body);
//     }
//   });
// });

// // SAVE NOTE BUTTON //
// $(document).on('click', '#savenote', function(){
//   // ARTICLE ID from SUBMIT BUTTON //

//   var thisId = $(this).attr('data-id');
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       title: $('#titleinput').val(),
//       body: $('#bodyinput').val()
//     }
//   }).done(function( data ) {
//     console.log(data);

//     $('#notes').empty();
//   });
//   $('#titleinput').val("");
//   $('#bodyinput').val("");
// });
