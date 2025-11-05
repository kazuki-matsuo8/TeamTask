class Task < ApplicationRecord
  belongs_to :user
  belongs_to :team

  validates :title, presence: true
  validates :status, presence: true
  validates :user, presence: true

  enum :status, { todo: 0, inprogress: 1, done: 2 }
end
