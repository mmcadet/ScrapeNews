// ARTICLE to JSON //
$.getJSON('/articles', function (data) {

  for (var i = 0; i < data.length; i++) {

    // PAGE DISPLAY //
    $('#articles').append('<p data-id="' + data[i]._id + '">' + data[i].title + '<br />' + data[i].link + '</p>');
  }
});

$(document).on('click', 'a', function () {
    // EMPTY NOTE //
  $('#notes').empty();

  var thisId = $(this).attr('data-id');

    // AJAX CALL for ARTICLE //
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
  .done(function( data ) {
    console.log(data);

    $('#notes').append('<h2>' + data.title + '</h2>');
    $('#notes').append('<input id="titleinput" name="title" >'); 
    $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
    $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
  
    if(data.note){
      $('#titleinput').val(data.note.title);
      $('#bodyinput').val(data.note.body);
    }
  });
});

// SAVE NOTE BUTTON //
$(document).on('click', '#savenote', function(){
  // ARTICLE ID from SUBMIT BUTTON //

  var thisId = $(this).attr('data-id');
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  }).done(function( data ) {
    console.log(data);

    $('#notes').empty();
  });
  $('#titleinput').val("");
});
