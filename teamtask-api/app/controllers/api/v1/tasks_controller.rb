class Api::V1::TasksController < ApplicationController
  before_action :authenticate
  before_action :set_team
  before_action :authorize_member
  before_action :set_task, only: [:update, :destroy]

  def index
    @tasks = @team.tasks.includes(:user)
    render json: @tasks, include: :user
  end

  def create
    user_id = params[:task][:user_id]

    unless @team.users.exists?(id: user_id)
      render json: { errors: ["有効な担当者（チームメンバー）を指定してください"] }, status: :unprocessable_entity
      return
    end

    @task = @team.tasks.build(task_params.merge(status: :todo))
    
    if @task.save
      render json: @task, status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    head :no_content
  end

  private

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
    params.require(:task).permit(:title, :content, :status, :due_date, :user_id)
  end
end