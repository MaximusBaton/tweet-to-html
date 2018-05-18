**NB**: this is a fork of [tweet-to-html](https://github.com/blessenm/tweet-to-html)


# tweet-to-html

[![Build Status](https://travis-ci.org/blessenm/tweet-to-html.svg?branch=master)](https://travis-ci.org/blessenm/tweet-to-html)
[![npm version](https://badge.fury.io/js/tweet-to-html.svg)](https://badge.fury.io/js/tweet-to-html)

Browser friendly package that converts twitter's API tweet objects text property to HTML. Takes care of all the entities and its links. Handles emoji's.


## Demo
http://blessanmathew.com/tweet-to-html

## Installation

```
$ npm install --save https://github.com/MaximusBaton/tweet-to-html.git
```

## Usage

There is only one method named `parse`. You can pass in a tweet object or an array of objects, and an optional config object. The response will be object/array tweet object with a new property named `html` with the parsed output.


```
var tweetToHTML = require('tweet-to-html');

var result  = tweetToHTML.parse(tweetObj); //Single tweet object
var results = tweetToHTML.parse(tweetArr); //Multiple tweets in an array

var photoConfig = {
  photoSize: 'large' // Any size supported by the `media` entity (thumb, small, medium...)
};

var result  = tweetToHTML.parse(tweetObj, photoConfig); //Single tweet object with specified image size

//output
console.log(result.html);
console.log(results[0].html);
```

##Issues Or Contributions

* Post issues/enhancements in the github issue tracker.
*  My email is blessenm@gmail.com
*  Pull requests are welcome.
*  [__Follow Me On Twitter__](https://twitter.com/blessenm86 "Follow Me On Twitter")
*  [__LinkedIn Pofile__](http://in.linkedin.com/pub/blessan-mathew/24/605/730 "LinkedIn Profie")
*  [__Stack Overflow Pofile__](http://stackoverflow.com/users/548568/blessenm "Stack Overflow Pofile")
