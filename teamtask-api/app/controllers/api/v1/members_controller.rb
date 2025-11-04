class Api::V1::MembersController < ApplicationController
  before_action :authenticate
  before_action :set_team
  before_action :authorize_member

  def create
    @user_to_invite = User.find(params[:user_id])

    if @team.users.include?(@user_to_invite)
      render json: { errors: ["ユーザーは既にチームに参加しています"] }, status: :unprocessable_entity
      return
    end

    @team.users << @user_to_invite
    render json: @user_to_invite, status: :created
  
  rescue ActiveRecord::RecordNotFound
    # ユーザーIDで見つからなかった場合のエラー
    render json: { errors: ["招待するユーザーが見つかりません"] }, status: :not_found
  rescue => e
    # その他のエラー処理
    render json: { errors: [e.message] }, status: :internal_server_error
  end

  def index
  render json: @team.users, except: [:password_digest]
  end

  private

  def set_team
    @team = Team.find(params[:team_id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["チームが見つかりません"] }, status: :not_found
  end

  def authorize_member
    unless @team.users.include?(@current_user)
      render json: { errors: ["あなたはこのチームのメンバーではありません"] }, status: :forbidden # 403 Forbidden
    end
  end
end