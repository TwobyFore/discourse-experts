# name: discourse_experts
# about: show expert categories in profile
# authors: Vairix
register_asset "javascripts/discourse/templates/user/categoryleaderboard.hbs"
register_asset "javascripts/discourse/helpers/category-link.js.es6"
register_asset "stylesheets/profile_expert.css"

after_initialize do
  Discourse::Application.routes.prepend do
    get "/users/expert_categories" => "users#expert_categories"
    get "/users/:username/categoryleaderboard" => "users#expert_categories"
  end

  load File.expand_path("../controllers/extended_users_controller.rb", __FILE__)
end
