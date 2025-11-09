class Team < ApplicationRecord
  has_many :team_users
  has_many :users, through: :team_users
  has_many :tasks
  has_many :messages, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
