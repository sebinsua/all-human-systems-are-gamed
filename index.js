var Spooky = require('spooky');

var spooky = new Spooky({
  child: {
    transport: 'http'
  },
  casper: {
    logLevel: 'debug',
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
    this.emit('hello', 'Hello, from ' + this.evaluate(function () {
      return document.title;
    }));
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
