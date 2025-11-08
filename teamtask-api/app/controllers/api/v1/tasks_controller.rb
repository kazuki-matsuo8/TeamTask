class Api::V1::TasksController < ApplicationController
  before_action :authenticate
  before_action :set_team
  before_action :authorize_member
  before_action :set_task, only: [:update, :destroy]

  def index
    @tasks = @team.tasks.includes(:users)
    render json: @tasks.as_json(include: :users), status: :ok
  end

  def create
    user_ids = params[:task][:user_ids]

    unless valid_team_member_assignment?(user_ids)
      return
    end

    @task = @team.tasks.build(task_params.merge(status: :todo))
    
    if @task.save
      @task.users = User.where(id: user_ids)
      render json: @task.as_json(include: :users), status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if params[:task].key?(:user_ids)
      unless valid_team_member_assignment?(params[:task][:user_ids])
        return
      end
    end

    if @task.update(task_params)
      render json: @task.as_json(include: :users), status: :ok
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @task.destroy
      head :no_content
    else
      render json: { errors: ["タスクの削除に失敗しました"] }, status: :unprocessable_entity
    end
  end

  private

  def valid_team_member_assignment?(user_ids)
    if user_ids.blank?
      render json: { errors: ["担当者を1人以上指定してください"] }, status: :unprocessable_entity
      return false
    end

    unless @team.users.exists?(id: user_ids)
      render json: { errors: ["有効な担当者（チームメンバー）を指定してください"] }, status: :unprocessable_entity
      return false
    end

    unless @team.users.where(id: user_ids).count == user_ids.uniq.count
      render json: { errors: ["指定された担当者の中に、チームメンバーではない人が含まれています"] }, status: :unprocessable_entity
      return false
    end

    true
  end

  def set_team
    @team = Team.find(params[:team_id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["チームが見つかりません"] }, status: :not_found
  end

  def authorize_member
    unless @team.users.include?(@current_user)
      render json: { errors: ["あなたはこのチームのメンバーではありません"] }, status: :forbidden
    end
  end

  def set_task
    @task = @team.tasks.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["タスクが見つかりません"] }, status: :not_found
  end

  def task_params
    params.require(:task).permit(:title, :content, :status, :deadline, user_ids: [])
  end
end