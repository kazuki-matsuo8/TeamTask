class User < ApplicationRecord
  has_secure_password
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  has_many :team_users
  has_many :teams, through: :team_users
  has_many :task_assignments
  has_many :tasks, through: :task_assignments
end
