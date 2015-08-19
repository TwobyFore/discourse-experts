export default {
  name: "category-leaderboard",

  initialize: function(container) {

    Discourse.UserCategoryleaderboardRoute = Discourse.Route.extend({

      userActionType: undefined,

      indexStream: function() {
        return true;
      },

      model: function() {
        var username = this.modelFor('user').get('username');
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

    Discourse.CategoryTitleLinkComponent.reopen({
        render: function(buffer) {
          var category = this.get('category'),
              logoUrl = category.get('logo_url'),
              categoryUrl = Discourse.Category.slugFor(category),
              categoryName = Handlebars.Utils.escapeExpression(category.get('name'));
          debugger
          if(typeof(category) == "string") {
            category = Discourse.Category.findBySlug(category.toLowerCase().replace(" ", "-"));
          }
          if (category.get('read_restricted')) {
            buffer.push("<i class='fa fa-lock'></i>");
          }

          var redirect_link;

          if(Discourse.SiteSettings.redirect_link){
            redirect_link = Discourse.SiteSettings.redirect_link;
          } else {
            redirect_link = Discourse.getURL("/c/");
          }

          buffer.push("<a href='" + redirect_link + categoryUrl + "'>");
          buffer.push("<span class='category-name'>" + categoryName + "</span>");

          if (!Em.isEmpty(logoUrl)) { buffer.push("<img src='" + logoUrl + "' class='category-logo'>"); }

          buffer.push("</a>");
        }
      });
  }
}
