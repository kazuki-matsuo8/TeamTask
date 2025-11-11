class Api::V1::MembersController < ApplicationController
  before_action :authenticate
  before_action :set_team
  before_action :authorize_member, except: [:create]

  def create
    unless @team.users.include?(@current_user)
      render json: { errors: ["チームメンバーのみが招待を行えます"] }, status: :forbidden
      return
    end
    
    @user_to_invite = User.find(params[:user_id])

    if @team.team_users.exists?(user_id: @user_to_invite.id)
      render json: { errors: ["ユーザーは既に招待済み、またはチームに参加しています"] }, status: :unprocessable_entity
      return
    end

    @team_user = @team.team_users.build(user: @user_to_invite, status: :inviting) 
    
    if @team_user.save
      render json: {
        id: @team_user.id,
        user_id: @team_user.user_id,
        team_id: @team_user.team_id,
        status: @team_user.status,
        created_at: @team_user.created_at,
        updated_at: @team_user.updated_at
      }, status: :created
    else
      render json: { errors: @team_user.errors.full_messages }, status: :unprocessable_entity
    end
  
  rescue ActiveRecord::RecordNotFound
    # ユーザーIDで見つからなかった場合のエラー
    render json: { errors: ["招待するユーザーが見つかりません"] }, status: :not_found
  rescue => e
    # その他のエラー処理
    render json: { errors: [e.message] }, status: :internal_server_error
  end

  def index
    @team_users = @team.team_users.accepted.includes(:user)
    
    @members_data = @team_users.map do |team_user|
      {
        id: team_user.user.id, 
        name: team_user.user.name,
        email: team_user.user.email,
        team_user_id: team_user.id, 
        role: team_user.role        
      }
    end
    
    render json: @members_data
  end

  def destroy
    @team_user_to_delete = @team.team_users.find(params[:id])
    if @team_user_to_delete.admin?
       render json: { errors: ["管理者はチームから削除できません。"] }, status: :forbidden
       return
    end
    if @team_user_to_delete.destroy
      head :no_content 
    else
      render json: { errors: ["メンバーの削除に失敗しました"] }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["削除対象のメンバーが見つかりません"] }, status: :not_found
  end

  private

  def set_team
    @team = Team.find(params[:team_id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["チームが見つかりません"] }, status: :not_found
  end

  def authorize_member
    unless @team.team_users.accepted.exists?(user_id: @current_user.id)
      render json: { errors: ["あなたはこのチームのメンバーではありません"] }, status: :forbidden 
    end
  end
end