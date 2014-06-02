Social = {
  facebook: function(id, access_token) {
    var params, url;
    url = "https://graph.facebook.com/" + id + "/posts/?callback=?";
    params = {
      access_token: access_token
    };
    // facebook timeline
	if ($("#facebook").length)
	{
		var fb_news	= $('#facebook'),
    		limit	= fb_news.data('limit') || 4;

		$.getJSON(url, params, function(data) {
      		var	items	= data.data.splice(0, limit);
      		$.each(items, function(index, value){
      			if (items[index].message)
      				items[index].message	= items[index].message.substring(0, 64)+'...';
      			if (items[index].message && items[index].caption)
      				items[index].caption	= '';
      			// console.log(items[index]);
      		});
			fb_news.html($.tmpl($("#facebook_template"), items));
			// console.log(items);

			// once loaded
			fb_news.imagesLoaded(function(){
				//$(".fb_date").timeago();
				var dates	= fb_news.find('.date');
				dates.each(function(){
					var e       = $(this),
						dateStr = e.text() ? e.text() : false;
					if (dateStr)
					{
						var m_names   = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
						//var fb_date   = new Date(dateStr.split("-").join("/"));
						var fb_date   = dateStr.split('T')[0].split('-'),
							fb_time   = dateStr.split('T')[1].split('+')[0],
							currDate  = new Date(),
							currYear  = currDate.getYear(),
							date      = new Date(fb_date[1]+'/'+fb_date[2]+'/'+fb_date[0]+' '+fb_time), // mm/dd/yyy hh:mm:ss
							day       = date.getDate(),
							month     = date.getMonth()+1,
							year      = date.getYear();
						// console.log(date);
						// e.text(m_names[month]+' '+day+''+(year < currYear ? ' '+year : ''));
						e.text(month+'.'+day);
					}
				});
				fb_news.autolink();
				// initialize Masonry
				// $fb_news.masonry({
				// 	itemSelector: 'li',
				// 'gutter':     10,
				// 	isFitWidth:   false,
				// 	singleMode:   false,
				// 	isAnimated:   false
				// });
			});
		});
	}
    if ($("#facebook_short").length)
    {
      $.getJSON(url, params, function(data) {
        var $fb_news  = $('#facebook_short'),
            $limit    = $fb_news.attr('data-limit') ? parseInt($fb_news.attr('data-limit')) : 3,
            $counter  = 0;
        $fb_news.html($.tmpl($("#facebook_short_template"), data.data));

        $('#facebook_short li').each(function(){
          var $li  = $(this);
          if (++$counter > $limit)
            $li.hide();
        });
        // once loaded
        $fb_news.imagesLoaded(function(){
          //$(".fb_date").timeago();
          $('.fb_date').each(function(){
            var e       = $(this),
                dateStr = e.text() ? e.text() : false;
                if (dateStr)
                {
                  var m_names   = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                  //var fb_date   = new Date(dateStr.split("-").join("/"));
                  var fb_date   = dateStr.split('T')[0].split('-'),
                      fb_time   = dateStr.split('T')[1].split('+')[0],
                      currDate  = new Date(),
                      currYear  = currDate.getYear(),
                      date      = new Date(fb_date[1]+'/'+fb_date[2]+'/'+fb_date[0]+' '+fb_time), // mm/dd/yyy hh:mm:ss
                      day       = date.getDate(),
                      month     = date.getMonth(),
                      year      = date.getYear();
                  //console.log(date);
                  e.text(m_names[month]+' '+day+''+(year < currYear ? ' '+year : ''));
                }
          });
          $fb_news.autolink();
        });
      });
    }
    // facebook albums
    /*url = "https://graph.facebook.com/" + id + "/albums/?callback=?";
    $.getJSON(url, params, function(data) {
      $("#facebook_albums").html($.tmpl($("#facebook_album_template"), data.data));
      var $fb_albums = $('#facebook_albums');
      $fb_albums.imagesLoaded(function(){
        // initialize Masonry
        $fb_albums.masonry({
          itemSelector: 'li',
          isFitWidth:   false,
          singleMode:   false,
          isAnimated:   false
        });
      });
    });*/
  },

  facebookPictureURL: function(picture) {
    return unescape(picture);
  },

  twitter: function(id) {
    var params, url;
    url = "http://api.twitter.com/1/statuses/user_timeline.json?callback=?";
    params = {
      include_rts: "1",
      screen_name: id
    };
    $.getJSON(url, params, function(data) {
      $("#twitter").html($.tmpl($("#twitter_template"), data));
      return $("#twitter abbr.timeago").timeago();
    });
  },

  vimeoPlayerLoad: function(videoId, autoPlay) {
    $("#vimeo_player").html($.tmpl($("#vimeo_player_template"), {
      id: videoId,
      autoPlay: autoPlay
    }));
  },

  vimeo: function(id, source) {
    var source_path, url;
    switch (source) {
      case "user":
        source_path = "/";
        break;
      case "channel":
        source_path = "/channel/";
    }
    if (!source_path) {
      return;
    }
    url = "http://vimeo.com/api/v2" + source_path + id + "/videos.json?callback=?";
    $.getJSON(url, function(data) {
      $("#vimeo").html($.tmpl($("#vimeo_template"), data));
      $("#vimeo abbr.timeago").timeago();
      $("#vimeo").autolink();
      if (data.length > 0) {
        Social.vimeoPlayerLoad(data[0].id);
      }
      $("#vimeo a.vimeo_link").click(function() {
        Social.vimeoPlayerLoad($(this).attr("id"), true);
        return false;
      });
    });
  },

  youtubePlayerLoad: function(videoId, autoPlay) {
    $("#youtube_player").html($.tmpl($("#youtube_player_template"), {
      id: videoId,
      autoPlay: autoPlay
    }));
  },

  youtube: function(id) {
    var params, url;
    url = "http://gdata.youtube.com/feeds/api/users/" + id + "/uploads?callback=?";
    params = {
      v: 2,
      alt: "json-in-script",
      format: 5
    };
    return $.getJSON(url, params, function(data) {
      var videoIdComponents;
      $("#youtube").html($.tmpl($("#youtube_template"), data.feed.entry));
      $("#youtube abbr.timeago").timeago();
      $("#youtube").autolink();
      if (data.feed.entry.length > 0) {
        videoIdComponents = data.feed.entry[0].id.$t.split(":");
        Social.youtubePlayerLoad(videoIdComponents[videoIdComponents.length - 1]);
      }
      $("#youtube a.youtube_link").click(function() {
        Social.youtubePlayerLoad($(this).attr("id"), true);
        return false;
      });
    });
  },

  formatVideoDuration: function(seconds) {
    var hours, minutes, time;
    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);
    time = "";
    if (hours > 0) {
      time = hours + ":";
    }
    if (minutes > 0 || time !== "") {
      minutes = minutes < 10 && time !== "" ? "0" + minutes : String(minutes);
      time += minutes + ":";
    }
    if (time === "") {
      time = seconds + "s";
    } else {
      time += seconds < 10 ? "0" + seconds : String(seconds);
    }
    return time;
  }
}
