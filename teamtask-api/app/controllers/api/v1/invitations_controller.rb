class Api::V1::InvitationsController < ApplicationController
  before_action :authenticate
  before_action :set_invitation

  def accept
    if @invitation.update(status: :accepted, role: :member)
      render json: @invitation.team, status: :ok
    else
      render json: { errors: @invitation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def reject
    @invitation.destroy
    head :no_content
  end

  private

  def set_invitation
    @invitation = TeamUser.find(params[:id])

    unless @invitation.user_id == @current_user.id
      render json: { errors: ["権限がありません"] }, status: :forbidden
      return
    end

    if @invitation.accepted?
      render json: { errors: ["この招待は既に承認済みです"] }, status: :unprocessable_entity
      return
    end
    
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["招待が見つかりません"] }, status: :not_found
  end
end
