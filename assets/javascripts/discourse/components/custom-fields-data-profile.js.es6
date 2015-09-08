export default Ember.Component.extend({
  tagName: 'div',
  layoutName: 'components/custom-fields-data',
  classNameBindings: ['custom-fields'],

  custom_fields: function() {
    var custom_fields = Ember.Object.create({
      "real_state_brokerage": "",
      "location": ""
    });

    var username = this.get('user').username;

    Discourse.User.findByUsername(username).then(function(res) {
      var real_state_brokerage = res.user_fields[2];
      var location = res.user_fields[11];

      if(real_state_brokerage) {
        custom_fields.set("real_state_brokerage", real_state_brokerage);
      } else {
        custom_fields.set("real_state_brokerage", "");
      }

      if(location) {
        custom_fields.set("location", location);
      } else {
        custom_fields.set("location", "");
      }
    });

    return custom_fields;
  }.property('custom_fields')
});
