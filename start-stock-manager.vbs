' Stock Manager - Optimal Launcher for Daily Use
Set WshShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get script directory and set working directory
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strScriptPath

' Check if already running on port 3001
Function IsAlreadyRunning()
    On Error Resume Next
    Set objExec = WshShell.Exec("netstat -an | findstr :3001")
    Do While Not objExec.StdOut.AtEndOfStream
        strLine = objExec.StdOut.ReadLine
        If InStr(strLine, "LISTENING") > 0 Then
            IsAlreadyRunning = True
            Exit Function
        End If
    Loop
    IsAlreadyRunning = False
End Function

' Main execution
If IsAlreadyRunning() Then
    ' Just open browser if already running
    WshShell.Run "http://localhost:3001", 1, False
Else
    ' Set environment variables
    WshShell.Environment("PROCESS").Item("PORT") = "3001"
    WshShell.Environment("PROCESS").Item("NODE_ENV") = "production"
    WshShell.Environment("PROCESS").Item("NEXT_TELEMETRY_DISABLED") = "1"
    
    ' Start the application (hidden console)
    WshShell.Run "cmd /c npm start", 0, False
    
    ' Wait 1 second for startup, then open browser
    WScript.Sleep 1000
    WshShell.Run "http://localhost:3001", 1, False
End If