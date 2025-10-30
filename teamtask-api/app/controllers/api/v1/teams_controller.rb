class Api::V1::TeamsController < ApplicationController
  before_action :authenticate

  def create
    @team = @current_user.teams.build(team_params)

    if @team.save
      render json: @team, status: :created
    else
      render json: { errors: @team.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def team_params
    params.require(:team).permit(:name, :description)
  end
end
