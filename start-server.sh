#!/bin/bash

# Remove all Replit paths from PATH
export PATH=$(echo $PATH | tr ':' '\n' | grep -v replit | tr '\n' ':' | sed 's/:$//')

# Load nvm and use Node 22
export NVM_DIR="$HOME/workspace/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22

# Start the Vite server on port 3000 (already forwarded in Codespaces)
cd client
npx vite --host 0.0.0.0 --port 3000 