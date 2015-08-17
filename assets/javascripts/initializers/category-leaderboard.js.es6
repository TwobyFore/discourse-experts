export default {
  name: "category-leaderboard",

  initialize: function(container) {

    Ember.Router.map(function() {
      this.resource('user', { path: '/users/:username' }, function() {
        this.route('categoryleaderboard');
      });
    });

    Discourse.UserCategoryleaderboardRoute = Discourse.Route.extend({
      userActionType: undefined,
      indexStream: function(){
        return true;
      },

      model: function() {
        var username = Discourse.User.current().get('username');
        var group = Discourse.SiteSettings.expert_group;
        return Ember.$.getJSON('/users/expert_categories.json?username='+username+'&group='+group);
      },

      actions: {
        didTransition: function() {
          this._super();
          $('.user-navigation .action-list li.active').removeClass('active');
          return true;
        }
      }
    });
  }
}
