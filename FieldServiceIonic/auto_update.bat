
@ECHO OFF

cls

SET /P VERSION=%Blue%Type a Version (e.g. - 1.1.1.1) to upload and press enter%Green% :
rem call :strLen VERSION strlen
rem SET /a strlen=%strlen%-2
rem echo String is %VERSION:~0,'%strlen%'% characters long
rem GOTO :EOF
powershell -Command "& {$xml = [xml](Get-Content 'config.xml'); $xml.widget.version = '%VERSION:~0,6%'; $xml.widget.'windows-packageVersion' = '%VERSION%'; $xml.Save('config.xml')}"

ionic cordova run windows -- --arch="x64"

xcopy "www\*.*" "%VERSION%\" /s/h/e/k/c/q

ECHO Folder "%VERSION%" created successfully.

del "%VERSION%\emerson_customers.sqlite"

ECHO %VERSION%\emerson_customers.sqlite deleted successfully.

del %VERSION%.zip 2>nul

ECHO Compressing...

powershell.exe -nologo -noprofile -command "& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::CreateFromDirectory('%VERSION%', '%VERSION%.zip'); }"

ECHO %VERSION%.zip created successfully.

del tmp.txt 2>nul

certutil -encode %VERSION%.zip tmp.txt && findstr /v /c:- tmp.txt > %VERSION%.txt

ECHO %VERSION%.txt created successfully.

del %VERSION%.zip 2>nul

rmdir /s/q %VERSION%

ECHO %VERSION% , %VERSION%.zip removed successfully. %White%

rem :strLen
rem setlocal enabledelayedexpansion

rem :strLen_Loop
rem    if not "!%1:~%len%!"=="" set /A len+=1 & goto :strLen_Loop
rem (endlocal & set %2=%len%)

GOTO :EOF