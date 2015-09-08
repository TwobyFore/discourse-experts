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
      var real_state_brokerage = res.user_fields[1];
      var location = res.user_fields[3];
      custom_fields.set("real_state_brokerage", real_state_brokerage);
      custom_fields.set("location", location);
    });

    return custom_fields;
  }.property('custom_fields')
});
