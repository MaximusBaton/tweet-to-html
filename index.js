var twemoji = require('twemoji' );

module.exports.parse = parseTweets;

var options = {};

function parseTweets(tweets, opts) {
  options = opts;
  return Array.isArray(tweets) ? tweets.map(parseTweet) : parseTweet(tweets);
}

function parseTweet(tweetObj) {
  var entityProcessors = {
    hashtags: processHashTags,
    symbols: processSymbols,
    user_mentions: processUserMentions,
    urls: processUrls,
    media: processMedia
  };

  var entities = tweetObj.entities;
  var processorObj;

  //Copying text value to a new property html. The final output will be set to this property
  tweetObj.html = tweetObj.text;

  //Process Emoji's
  processEmoji(tweetObj);

  //Process entities
  if(Object.getOwnPropertyNames(entities).length) {
    Object.keys(entities).forEach((entity) => {
      if(entities[entity].length) {
        processorObj = entities[entity];

        //Need to check if entity is media. If so, extended_entities should be used
        processorObj = entity === 'media' ? tweetObj.extended_entities.media : processorObj;

        entityProcessors[entity](processorObj, tweetObj);
      }
    });
  }

  return tweetObj;
}

function processHashTags(tags, tweetObj) {
  tags.forEach((tagObj) => {
    var anchor = ('#' + tagObj.text).link('//twitter.com/hashtag/' + tagObj.text);
    tweetObj.html = tweetObj.html.replace('#' + tagObj.text, anchor);
  });
}

function processSymbols(symbols, tweetObj) {}

function processUserMentions(users, tweetObj) {
  users.forEach((userObj) => {
    var anchor = ('@' + userObj.screen_name).link('//twitter.com/' + userObj.screen_name);
    var regex = new RegExp('@' + userObj.screen_name, 'gi' );
    tweetObj.html = tweetObj.html.replace(regex, anchor);
  });
}

function processUrls(urls, tweetObj) {
  urls.forEach((urlObj, index) => {
    var quotedTweetHtml = '';
    var indices = urlObj.indices;
    var urlToReplace = tweetObj.text.substring(indices[0],indices[1]);

    if(index === urls.length-1 && tweetObj.quoted_status) {
      let quotedContainerClass = 'quoted-tweet';
      if(options && options.quotedContainerClass) {
        quotedContainerClass = options.quotedContainerClass;
      }
    
      quotedTweetHtml = parseTweets(tweetObj.quoted_status).html;
      quotedTweetHtml = `<div class="${quotedContainerClass}">${quotedTweetHtml}</div>`
    }

    var finalText = quotedTweetHtml || urlObj.display_url.link(urlObj.expanded_url);
    tweetObj.html = tweetObj.html.replace(urlToReplace, finalText);
  });
}

function processMedia(media, tweetObj) {
  media.forEach((mediaObj) => {
    if(mediaObj.type === 'photo') {
      // Use HTTPS if available
      var src = mediaObj.media_url_https ? mediaObj.media_url_https : mediaObj.media_url;

      if(options &&
        options.photoSize &&
        mediaObj.sizes &&
        mediaObj.sizes[options.photoSize]) {
        // If specified size is available, patch image src to use it
        src = src + ':' + options.photoSize;
      }

      var image = '<img src="' + src + '"/>';
      tweetObj.html = tweetObj.html.replace(mediaObj.url, image);
    } else if(mediaObj.type === 'video') {
      var source = '';
      mediaObj.video_info.variants.forEach((info) => {
        source += '<source src="'+ info.url +'" type="'+ info.content_type +'">';
      });
      var video = '<video controls poster="' + mediaObj.media_url +'">' + source + '</video>';
      tweetObj.html = tweetObj.html.replace(mediaObj.url, video);
    }
  });
}

function processEmoji(tweetObj) {
  tweetObj.html = twemoji.parse(tweetObj.html);
}
