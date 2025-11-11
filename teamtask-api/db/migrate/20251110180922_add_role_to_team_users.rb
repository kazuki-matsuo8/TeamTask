class AddRoleToTeamUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :team_users, :role, :integer, default: 1, null: false
  end
end
