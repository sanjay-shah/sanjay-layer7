Layer7 = {};

var querystring = Npm.require('querystring');


OAuth.registerService('layer7', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var identity = getIdentity(accessToken);

  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn)
  };
  
  /*************************************************************
  / Future release: Get whitelisted feilds from Service.Config /
  /*************************************************************
  var config = ServiceConfiguration.configurations.findOne({
    service: 'layer7'
  });
  if (!config)
    throw new ServiceConfiguration.ConfigError();
  *************************************************************/

  // include all fields from layer7 userInfo endpoint
  // 
  var whitelisted = ['id', 'email', 'name', 'first_name',
    'last_name', 'link', 'username', 'gender', 'locale', 'age_range'
  ];

  var fields = _.pick(identity, whitelisted);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {
      profile: {
        name: identity.name
      }
    }
  };
});

// checks whether a string parses as JSON
var isJSON = function(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function(query) {
  var config = ServiceConfiguration.configurations.findOne({
    service: 'layer7'
  });
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var responseContent;
  try {
    // Request an access token
    //responseContent = HTTP.get(
    result = HTTP.post(
      config.tokenEndpoint, {
        params: {
          client_id: config.appId,
          redirect_uri: OAuth._redirectUri('layer7', config),
          client_secret: OAuth.openSecret(config.secret),
          code: query.code,
          grant_type: 'authorization_code'
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Layer7. " + err.message), {
      response: err.response
    });
  }
  if (result.data) {
    return {
      accessToken: result.data.access_token,
      expiresIn: result.data.expires_in
    };
  }
};

var getIdentity = function(accessToken) {
  var config = ServiceConfiguration.configurations.findOne({
    service: 'layer7'
  });
  if (!config)
    throw new ServiceConfiguration.ConfigError();
    
  try {
    return HTTP.get(config.userInfoEndpoint, {
      params: {
        access_token: accessToken
      }
    }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Layer7. " + err.message), {
      response: err.response
    });
  }
};

Layer7.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
