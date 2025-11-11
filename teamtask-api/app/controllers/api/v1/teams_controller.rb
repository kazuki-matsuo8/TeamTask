class Api::V1::TeamsController < ApplicationController
  before_action :authenticate
  before_action :set_team, only: [:show]
  before_action :authorize_member, only: [:show]

  def create
    @team = Team.new(team_params)

    if @team.save
      @team_user = @team.team_users.build(
        user: @current_user,
        status: :accepted,
        role: :admin       
      )
      if @team_user.save
        render json: @team, status: :created
      else
        # 作成したチームを削除して、処理を元に戻す。
        @team.destroy
        render json: { errors: @team_user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: @team.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: @team, status: :ok
  end

  private

  def team_params
    params.require(:team).permit(:name, :description)
  end

  def set_team
    @team = Team.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["チームが見つかりません"] }, status: :not_found
  end

  def authorize_member
    unless @team.users.include?(@current_user)
      render json: { errors: ["あなたはこのチームのメンバーではありません"] }, status: :forbidden 
    end
  end
end