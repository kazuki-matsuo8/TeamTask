Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:create, :index]
      resources :teams, only: [:create] do
        # /api/v1/teams/:team_id/members
        resources :members, only: [:create]
      end
      post '/login', to: 'authentication#create'
    end
  end
end
