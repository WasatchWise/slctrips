#!/bin/bash

# Install Node.js 22 and clean up Replit residue
echo "Installing Node.js 22 and cleaning Replit residue..."

# Clean up Replit residue from PATH
export PATH=$(echo $PATH | tr ':' '\n' | grep -v "replit-runtime-path" | tr '\n' ':' | sed 's/:$//')

# Set up nvm in workspace
export NVM_DIR="$HOME/workspace/.config/nvm"
mkdir -p "$NVM_DIR"

# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Source nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# Verify installation
echo "Node.js version:"
node --version

echo "npm version:"
npm --version

# Create .nvmrc file
echo "22" > .nvmrc

echo "✅ Node.js 22 installed and Replit residue cleaned!" 