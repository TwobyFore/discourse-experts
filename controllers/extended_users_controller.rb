UsersController.class_eval do

  def expert_categories
    response = { expert_categories: [] }

    user = User.joins(:groups).where(username: params[:username], groups: { name: params[:group] }).first

    if user.present?
      categories = Category.joins(topics: { posts: :user }).where(users: { username: params[:username] }).group(:id)

      categories.each do |cat|
        likes_list = Post.select('posts.user_id, topics.category_id, sum(posts.like_count) as cat_like_count')
                         .joins(:topic).group('posts.user_id, topics.category_id')
                         .where(topics: { category_id: cat.id })
                         .order('cat_like_count desc')
        target_list = []
        target_list = likes_list[0..(likes_list.length/4)] if likes_list.length > 0 # Best %25

        if target_list.any? { |item| item.user_id == user.id }
          posts_count = 0
          views_count = 0
          likes_count = 0
          most_liked_posts = []
          cat.topics.each do |topic|
            most_liked_post = topic.posts.order(like_count: :desc).first
            most_liked_posts << most_liked_post if most_liked_post.user_id == user.id
            posts_count+= posts_count = topic.posts.where(user_id: user.id).count
            views_count+= topic.views
            likes_count+= topic.posts.sum(:like_count)
          end
          response[:expert_categories] << { category: cat.name, posts: posts_count, views: views_count, likes: likes_count, top_answers: most_liked_posts.count }
        end
      end
    end
    render json: response
  end
end
