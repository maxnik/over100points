var ITEMS_PER_PAGE = 30;

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values/901144#901144
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {
  var page = parseInt( getParameterByName('page') ) || 1;

  var hnsearch_api = "http://api.thriftdb.com/api.hnsearch.com/items/" + 
  "_search?filter[fields][points]=[100%20TO%20*]&sortby=create_ts%20desc&start=" + 
  ((page - 1) * ITEMS_PER_PAGE) + "&limit=" + ITEMS_PER_PAGE + "&callback=?";

  var items_list = $('#items');

  $.getJSON( hnsearch_api )
    .done(function( data ) {
      // set the starting point of the ordered list
      items_list.attr('start', ( (page - 1) * ITEMS_PER_PAGE ) + 1);
      
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

