var ITEMS_PER_PAGE = 30;

var page = 0;

var items_list = null;
var previous_button = null;
var previous_button_link = null;

$(document).ready(function () {
  items_list = $('#items');
  previous_button = $('#pagination .disabled');
  previous_button_link = $('#previous-button');

  previous_button_link.on('click', function () {
    if (page > 0) {
      page = page - 1;
      load_items( page );
    }
    return false;
  });

  $('#next-button').on('click', function () {
    page = page + 1;
    load_items( page );
    return false;
  });

  load_items( page );
});

function load_items( page ) 
{
  var hnsearch_api = "http://api.thriftdb.com/api.hnsearch.com/items/" + 
  "_search?filter[fields][points]=[100%20TO%20*]&sortby=create_ts%20desc&start=" + 
  (page * ITEMS_PER_PAGE) + "&limit=" + ITEMS_PER_PAGE + "&callback=?";

  $.getJSON( hnsearch_api )
    .done(function( data ) {
      // set the starting point of the ordered list
      items_list.attr('start', (page * ITEMS_PER_PAGE) + 1);
      
      var results = data.results;
      var item = null;
      var items = [];
      for (var i = 0; i < results.length; i++) {
        item = results[i].item;
        items.push('<li><a href="' + item.url + '">' + item.title + '</a>' + '</li>');
      }
      items_list.html( items.join( '' ) );
      
      if (1 === page) {
        change_previous_button( true );
      } else if (0 === page) {
        change_previous_button( false );
      }
    })
    .fail(function( jqxhr, textStatus, error ) {
      $( "#main-container" ).prepend( "<div>Request Failed: " + 
        textStatus + ', ' + error + "</div>");
      $('#pagination').hide();
    }); 
}

function change_previous_button( activate )
{
  if (activate) {
    previous_button.removeClass('disabled');
    previous_button_link.attr('href', '');
  } else {
    previous_button.addClass('disabled');
    previous_button_link.removeAttr('href');
  }
}
