
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/events'),
  curation = require('./routes/curations')

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partial/:name', routes.partial);

// JSON API

app.get('/api/event',api.getEvent);
app.get('/api/events',api.getEvents);
app.get('/api/events/graph',api.getEventsGraph);
app.get('/api/events/channels',api.getChannel);
app.get('/api/events/futures',api.getFutures);

app.get('/api/curation',curation.getCuration);
app.get('/api/curations',curation.getCurations);
app.get('/api/curations/ivfstatus',curation.getVisibilityStatus);
app.get('/api/curations/ivfforce',curation.forceIVF);


app.get('/api/event/indexstatus',api.getIndexStatus);
app.get('/api/event/forcedelete',api.forceDelete);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Server started");
});
