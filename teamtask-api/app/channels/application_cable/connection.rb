module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token]

      if token.blank?
        reject_unauthorized_connection
        return
      end

      begin
        secret_key = Rails.application.credentials.secret_key_base
        decoded_token = JWT.decode(token, secret_key, true)
        # 認証に成功したら current_user に設定
        if (verified_user = User.find(decoded_token[0]["user_id"]))
          verified_user
        else
          reject_unauthorized_connection
        end
      rescue ActiveRecord::RecordNotFound, JWT::ExpiredSignature, JWT::DecodeError
        reject_unauthorized_connection
      end
    end
  end
end