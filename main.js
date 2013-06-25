var ITEMS_PER_PAGE = 30;

var page = 0;

$(document).ready(function () {

  var hnsearch_api = "http://api.thriftdb.com/api.hnsearch.com/items/" + 
  "_search?filter[fields][points]=[100%20TO%20*]&sortby=create_ts%20desc&start=" + 
  (page * ITEMS_PER_PAGE) + "&limit=" + ITEMS_PER_PAGE + "&callback=?";

  var items_list = $('#items');

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
    })
    .fail(function( jqxhr, textStatus, error ) {
      $( "#main-container" ).prepend( "<div>Request Failed: " + 
        textStatus + ', ' + error + "</div>");
      $('#pagination').hide();
    });
});

