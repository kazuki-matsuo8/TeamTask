Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:create]
      resources :teams, only: [:create]
      post '/login', to: 'authentication#create'
    end
  end
end
