#!/usr/bin/env bash
# Run from the project root: bash scripts/make-github-zip.sh
zip -r ../eduforge-learning-hub-github.zip . -x "node_modules/*" ".next/*" ".git/*" ".env" ".env.*" "!.env.example" "out/*" "android/*"
