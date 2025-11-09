class TeamUser < ApplicationRecord
  belongs_to :user
  belongs_to :team

  enum :status, {
    inviting: 0,  
    accepted: 1  
  }
end
