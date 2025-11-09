class Api::V1::MessagesController < ApplicationController
  before_action :authenticate
  before_action :set_team

  def index
    @messages = @team.messages.includes(:user).order(created_at: :desc).limit(50)
    render json: @messages.map { |message| message_response(message) }
  end

  def create
    @message = @team.messages.build(message_params)
    @message.user = current_user

    if @message.save
      render json: message_response(@message), status: :created
    else
      render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_team
    @team = Team.find(params[:team_id])
  end

  def message_params
    params.require(:message).permit(:content)
  end

  def message_response(message)
    {
      id: message.id,
      content: message.content,
      user: {
        id: message.user.id,
        name: message.user.name
      },
      created_at: message.created_at
    }
  end
end