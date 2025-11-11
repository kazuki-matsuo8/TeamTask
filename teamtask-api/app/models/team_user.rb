class TeamUser < ApplicationRecord
  belongs_to :user
  belongs_to :team

  enum :status, {
    inviting: 0,  
    accepted: 1  
  }

  enum :role, {
    admin: 0,
    member: 1
  }
end
