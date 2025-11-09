# Mount Action Cable outside main process or domain
Rails.application.config.action_cable.mount_path = '/cable'

# Disable request forgery protection for WebSocket connections
Rails.application.config.action_cable.disable_request_forgery_protection = true

# Allow connections from any origin in development
Rails.application.config.action_cable.allowed_request_origins = [
  'http://localhost:5173', 
  /http:\/\/localhost:*/   
]