# Run from the project root in PowerShell: .\scripts\make-github-zip.ps1
$skip = "node_modules|\\.next|\\.git\\|\\.env($|\.local)|\\out\\|\\android\\"
$files = Get-ChildItem -Recurse -File -Force | Where-Object { $_.FullName -notmatch $skip }
Compress-Archive -Path $files.FullName -DestinationPath ..\eduforge-learning-hub-github.zip -Force
