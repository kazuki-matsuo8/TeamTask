class Api::V1::TeamsController < ApplicationController
  before_action :authenticate
  before_action :set_team, only: [:show]
  before_action :authorize_member, only: [:show]

  def create
    @team = @current_user.teams.build(team_params)

    if @team.save
      render json: @team, status: :created
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