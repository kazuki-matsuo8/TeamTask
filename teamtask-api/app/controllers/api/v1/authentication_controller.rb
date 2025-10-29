class Api::V1::AuthenticationController < ApplicationController
  def create
    @user = User.find_by(email: params[:email])
    
    if @user && @user.authenticate(params[:password])
      token = create_token(@user.id)
      render json: { token: token }, status: :created
    else
      render json: { errors: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
    end
  end
end
