class Api::V1::DashboardController < ApplicationController
  before_action :authenticate

  def index
    inviting_team_users = @current_user.team_users.inviting.includes(:team)

    @pending_invitations = inviting_team_users.map do |team_user|
      {
        invitation_id: team_user.id,
        team: team_user.team
      }
    end

    @upcoming_tasks = @current_user.tasks
                                .where(status: [:todo, :inprogress])
                                .where("deadline BETWEEN ? AND ?", Time.current, 3.days.from_now)
                                .order(deadline: :asc)
                                .includes(:team, :users)

    render json: {
      pending_invitations: @pending_invitations,
      upcoming_tasks: @upcoming_tasks.as_json(include: [:team, :users])
    }
  end
end
