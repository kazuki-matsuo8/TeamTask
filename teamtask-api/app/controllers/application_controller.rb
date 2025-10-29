class ApplicationController < ActionController::API
  # ユーザーIDを受け取り、JWT（認証トークン）を生成して返すメソッド
  def create_token(user_id)
    # トークンに含める情報（ペイロード）を設定。ユーザーIDと有効期限（14日後）を含める
    payload = { user_id: user_id, exp: (DateTime.current + 14.days).to_i }
    # トークンの署名に使う、アプリケーション固有の秘密鍵を取得
    secret_key = Rails.application.credentials.secret_key_base
    # payloadと秘密鍵を使って、JWTを生成（エンコード）
    token = JWT.encode(payload, secret_key)
    token
  end

  # リクエストに有効なJWTが含まれているか検証し、ユーザーを認証するメソッド
  # before_actionとして、認証が必要なコントローラで呼び出される
  def authenticate
    # リクエストヘッダーから'Authorization'の値を取得
    authorization_header = request.headers[:authorization]
    if !authorization_header
      render_unauthorized
    else
      # ヘッダーの値 "Bearer <token>" をスペースで分割し、トークン本体を取得
      token = authorization_header.split(" ")[1]
      # 署名に使った秘密鍵を再度取得
      secret_key = Rails.application.credentials.secret_key_base

      begin
        # 秘密鍵を使ってトークンを検証・解読（デコード）
        decoded_token = JWT.decode(token, secret_key)
        # デコードしたトークンからユーザーIDを取り出し、DBからユーザーを検索して@current_userにセット
        @current_user = User.find(decoded_token[0]["user_id"])
      rescue ActiveRecord::RecordNotFound
        render_unauthorized
      rescue JWT::DecodeError
        render_unauthorized
      end
    end
  end

  def render_unauthorized
    render json: { errors: "Unauthorized" }, status: :unauthorized
  end

  private

  def current_user
    @current_user
  end
end
