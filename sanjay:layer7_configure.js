Template.configureLoginServiceDialogForLayer7.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForLayer7.fields = function () {
  return [
    {property: 'appId', label: 'Client ID / API key'},
    {property: 'secret', label: 'Secret'},
    {property: 'authorizeEndpoint', label: 'Authorization Endpoint'},
    {property: 'tokenEndpoint', label: 'Token Endpoint'},
    {property: 'userInfoEndpoint', label: 'UserInfo Endpoint'}
  ];
};
