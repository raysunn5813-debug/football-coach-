$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Football Coach.lnk")
$Shortcut.TargetPath = "c:\football coach\start.bat"
$Shortcut.WorkingDirectory = "c:\football coach"
$Shortcut.Save()
Write-Host "Shortcut created successfully at $DesktopPath\Football Coach.lnk"
