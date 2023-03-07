LogWippe = function()
	clear_screen
	print("<b>[<color=#FAFF00>!</color>] Trying to Delete system.log...")
	SysLog = get_shell.host_computer.File("/etc/fstab")
	SysLog.copy("/var", "system.log")
	print("<b>[<color=#68FF00>+</color>] Sucess Deleting the File <color=#FAFF00>system.log")
end function
print("<b> Run in Sudo to work")
if params.len != 1 then exit("<b> LogW [Seconds] - Every X Seconds it Wippes the Logs")
while(true)
	LogWippe()
	wait(params[0].to_int)
end while