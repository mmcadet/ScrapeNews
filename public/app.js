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

    
  });


});
