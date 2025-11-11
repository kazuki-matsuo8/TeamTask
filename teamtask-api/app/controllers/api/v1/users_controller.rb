class Api::V1::UsersController < ApplicationController
  before_action :authenticate, only: [:index, :show, :update]
  def create
    @user = User.new(user_params)
    if @user.save
      token = create_token(@user.id)

      render json: { token: token, user: @user }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    @users = User.all
    render json: @users, except: [:password_digest]
  end

  def show
    render json: user_response(@current_user), status: :ok
  end

  def update
    params_to_update = user_params
    if params_to_update[:password].blank?
      params_to_update.delete(:password)
      params_to_update.delete(:password_confirmation)
    end

    if @current_user.update(params_to_update)
      render json: user_response(@current_user), status: :ok
    else
      render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def user_response(user)
    user.as_json(except: :password_digest)
  end
end
