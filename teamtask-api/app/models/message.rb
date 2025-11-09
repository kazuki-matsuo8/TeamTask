# チャットメッセージを管理するモデル
# WebSocketを通じてリアルタイムに配信される
class Message < ApplicationRecord
  belongs_to :team
  belongs_to :user

  validates :content, presence: true
  validates :team, presence: true
  validates :user, presence: true

  # メッセージが作成された後に実行されるコールバック
  # WebSocketを通じて接続中のクライアントに新しいメッセージを通知
  after_create_commit { broadcast_to_team }

  private

  # Action Cableを使用してチームメンバーにメッセージをブロードキャスト
  # @note TeamChatChannelを通じて、チームに所属する全クライアントにメッセージを配信
  def broadcast_to_team
    TeamChatChannel.broadcast_to(
      team,
      {
        id: id,
        content: content,
        user: {
          id: user.id,
          name: user.name
        },
        created_at: created_at
      }
    )
  end
end
