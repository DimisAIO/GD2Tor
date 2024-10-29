@echo off
cmd /c ncc build index.js
cmd /c pkg dist/index.js -t node18-win-x64