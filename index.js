var config = require('./config.json'),
    Spooky = require('spooky');

var spooky = new Spooky({
  child: {
    transport: 'http'
  },
  casper: {
    logLevel: 'info',
    verbose: true
  }
}, function (err) {
  if (err) {
    e = new Error('Failed to initialize SpookyJS');
    e.details = err;
    throw e;
  }

  spooky.start('https://linkedin.com');

  spooky.then(function () {
    this.evaluate(function () {
      document.querySelector('input[name="session_key"]').value = "[username]";
      document.querySelector('input[name="session_password"]').value = "[password]";
      document.querySelector('form[name="login"]').submit();
    });
  });

  spooky.then(function () {
    this.log('Logged in.');

    this.open('http://www.linkedin.com/vsearch/p?f_N=S,O&f_SE=5,3&f_G=gb%3A0&page_num=1');
  });

  spooky.then(function () {
    // .next a.page-link

    var hrefs = this.evaluate(function () {
      var peopleDom = document.querySelectorAll('.people h3 a.title');
      var hrefs = [];
      for (var i = 0; i < peopleDom.length; i++) {
        hrefs.push(peopleDom[i].href);
      }
      return hrefs;
    });

    for (var i = 0; i < hrefs.length; i++) {
      // this.emit('console', hrefs[i]);
    }
    this.open(hrefs[0]); // @todo: Find out how to loop with phantom.js. May
                         //        have to alter Spooky!
  });

  spooky.then(function () {
    this.capture('page.png');
    // @todo: Work out why this wasn't registered on LinkedIn.
    this.emit('console', this.evaluate(function () { return document.title; }));
  });

  spooky.run();
});

spooky.on('error', function (e, stack) {
  console.error(e);

  if (stack) {
    console.log(stack);
  }
});

spooky.on('console', function (line) {
  console.log(line);
});

spooky.on('hello', function (greeting) {
  console.log(greeting);
});

spooky.on('log', function (log) {
  if (log.space === 'remote') {
    console.log(log.message.replace(/ \- .*/, ''));
  }
});
