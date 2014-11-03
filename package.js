Package.describe({
  name: 'sanjay:layer7',
  summary: 'Layer7 OAuth flow',
  version: '1.0.0',
  git: 'https://github.com/sanjay-shah/sanjay-layer7.git'
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  
  api.export('Layer7');

  api.add_files(
    ['sanjay:layer7_configure.html', 'sanjay:layer7_configure.js'],
    'client');

  api.add_files('sanjay:layer7_server.js', 'server');
  api.add_files('sanjay:layer7_client.js', 'client');
  
  api.versionsFrom('METEOR@1.0');
  //api.addFiles('sanjay:layer7.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('sanjay:layer7');
  api.addFiles('sanjay:layer7-tests.js');
});
