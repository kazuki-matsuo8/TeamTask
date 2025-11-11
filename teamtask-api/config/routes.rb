Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:create, :index]
      resources :teams, only: [:create, :show] do
        # /api/v1/teams/:team_id/members
        resources :members, only: [:create, :index, :destroy]
        resources :tasks, only: [:index, :create, :update, :destroy]
        resources :messages, only: [:index, :create]
      end
      post '/login', to: 'authentication#create'
      resources :invitations, only: [] do
        member do
          patch :accept   
          delete :reject  
        end
      end
      resources :dashboard, only: [:index]
    end
  end
end
