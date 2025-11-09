class TeamChatChannel < ApplicationCable::Channel
  # チャットルームへの接続時の処理
  def subscribed
    team = Team.find(params[:team_id])
    # このチームのメッセージのみを配信
    stream_for team
  end

  # チャットルームからの切断時の処理
  def unsubscribed
    stop_all_streams
  end

  # クライアントからメッセージを受信したときの処理
  def receive(data)
    # メッセージをデータベースに保存
    team = Team.find(params[:team_id])
    # メッセージを保存すると自動配信される
    Message.create!(
      content: data["content"],
      team: team,
      user: current_user
    )
  end
end