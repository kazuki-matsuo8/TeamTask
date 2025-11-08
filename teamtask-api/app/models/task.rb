class Task < ApplicationRecord
  belongs_to :team

  validates :title, presence: true
  validates :status, presence: true
  validates :users, presence: true

  enum :status, { todo: 0, inprogress: 1, done: 2 }

  has_many :task_assignments, dependent: :destroy
  has_many :users, through: :task_assignments
end
