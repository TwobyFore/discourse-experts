export default Ember.Component.extend({
  tagName: 'span',
  layoutName: 'components/profile-badge',

  badge: function() {
    var badge = Discourse.Badge.create({});
    var username = window.location.pathname.split('/')[2];
    Discourse.User.findByUsername(username).then(function(res){
      res.featured_user_badges.forEach(function(b){
        var badge_aux = Discourse.Badge.createFromJson(b);
        if (badge_aux.name.indexOf('brokerage') == 0){
          badge.setProperties(badge_aux);
          badge.set('href', '/badges/'+badge.id+'/'+badge.name)
        }
      });
    });
    return badge;
  }.property('badge')
});
