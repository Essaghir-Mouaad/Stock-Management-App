' Simple Stop Stock Manager
Set WshShell = CreateObject("WScript.Shell")

' Kill Node.js processes
WshShell.Run "taskkill /f /im node.exe", 0, True
WshShell.Run "taskkill /f /im npm.cmd", 0, True

' Brief confirmation
WScript.Sleep 1000
MsgBox "Stock Manager stopped successfully!", vbInformation + vbSystemModal, "Stock Manager"