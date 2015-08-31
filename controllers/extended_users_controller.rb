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
          reads_count = 0
          likes_count = 0
          most_liked_posts = []
          cat.topics.each do |topic|
            counter = topic.posts.where(user_id: user.id).select("sum(posts.like_count) as like_count, count(*) as count, sum(posts.reads) as reads")
            most_liked_post = topic.posts.order(like_count: :desc).first
            most_liked_posts << most_liked_post if most_liked_post.user_id == user.id
            posts_count+= counter[0].count
            reads_count+= counter[0].reads || 0
            likes_count+= counter[0].like_count || 0
          end
          rank = target_list.find_index { |u| u.user_id = user.id }
          response[:expert_categories] << { category: cat.name, rank: rank+1, posts: posts_count, likes: likes_count, reads: reads_count, top_answers: most_liked_posts.count }
        end
      end
    end
    ordered_categories = response[:expert_categories].sort_by{ |a| a[:rank] }.reverse
    response[:expert_categories] = ordered_categories
    render json: response
  end
end
