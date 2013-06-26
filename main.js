var ITEMS_PER_PAGE = 30;

var page = 0;

var items_list = null;
var previous_button = null;
var previous_button_link = null;
var html_body = null;

$(document).ready(function () {
  items_list = $('#items');
  previous_button = $('#pagination .disabled');
  previous_button_link = $('#previous-button');
  html_body = $('html, body');

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
        items.push('<li><p class="title"><a href="' + get_url( item ) + '">' + item.title + '</a> ' + 
        '<span class="domain">' + get_domain( item ) + '</span></p>' +
        '<p><span class="stats">' + item.points + ' points | ' + 
        time_to_words( item.create_ts ) + ' ago | ' +
        '<a href="' + get_comments_url( item ) + '">' +
        item.num_comments + ' comments</a></span></p></li>');
      }
      items_list.html( items.join( '' ) );
      
      html_body.animate({ scrollTop: items_list.offset().top }, 1000);

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

var rfc3339_date = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;
var msec_in_minute = 1000.0 * 60;
var msec_in_hour = msec_in_minute * 60;
var msec_in_day = msec_in_hour * 24;
var msec_in_week = msec_in_day * 7;
var msec_in_month = msec_in_day * 30;
var msec_in_year = msec_in_day * 365;

function time_to_words( datetime ) 
{    
  var m = rfc3339_date.exec( datetime );
  var year   = m[1];
  var month  = m[2];
  var day    = m[3];
  var hour   = m[4];
  var minute = m[5];
  var second = m[6];
  var then = Date.UTC(year, month - 1, day, hour, minute, second);
  var now = (new Date()).getTime();
  var interval = now - then;
  var time_ago = null;
  if (interval > msec_in_year) {
    time_ago = Math.round( interval / msec_in_year ) + " years";
  } else if (interval > msec_in_month) {
    time_ago = Math.round( interval / msec_in_month ) + " months";
  } else if (interval > msec_in_week) {
    time_ago = Math.round( interval / msec_in_week ) + " weeks";
  } else if (interval > msec_in_day) {
    time_ago = Math.round( interval / msec_in_day ) + " days";
  } else if (interval > msec_in_hour) {
    time_ago = Math.round( interval / msec_in_hour ) + " hours";
  } else {
    time_ago = Math.round( interval / msec_in_minute ) + " minutes";
  }
  return time_ago;
}

function get_domain( item )
{
  var domain = '';
  if (item.domain) {
    domain = '(' + item.domain + ')';
  }
  return domain;
}

function get_url( item )
{
  var url = '';
  if (item.url) {
    url = item.url;
  } else {
    url = get_comments_url( item );
  }
  return url;
}

function get_comments_url( item )
{
  return 'https://news.ycombinator.com/item?id=' + item.id; 
}
