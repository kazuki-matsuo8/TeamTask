class AddStatusToTeamUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :team_users, :status, :integer
  end
end
