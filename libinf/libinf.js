//Load Apt
aptclient = include_lib("/lib/aptclient.so")
if not aptclient then
    aptclient = include_lib(current_path + "/aptclient.so")
end if
if not aptclient then exit("Error: Missing aptclient.so library in the /lib path or the current folder")
//Load MetaExploit
metaxploit = include_lib("/lib/metaxploit.so")
if not metaxploit then
    metaxploit = include_lib(current_path + "/metaxploit.so")
end if
if not metaxploit then exit("<b>[<color=#FF005C>-</color>] Error: Can't find metaxploit library")
//Check Version
LibList = get_shell.host_computer.File("/lib/").get_files
print("<b>[<color=#68FF00>+</color>] Libraries in the computer : ")
num = 0
for Lib in LibList
	metalib = metaxploit.load(Lib.path)
	print("<b>	[<color=#FAFF00>!</color>] Lib : <color=#FAFF00>"+ metalib.lib_name +"</color> Version : <color=#FAFF00>"+ metalib.version +"</color>")
	num = num + 1
end for
//Ask to Scan Libs
ScanR = ""
while (ScanR != "y") and (ScanR != "n")
	ScanR = user_input("<b>[<color=#FAFF00>!</color>] Update Libraries ? (Y/N) : ").lower
end while
//Function to Scan Vulnerabilities
ScanLib = function(libs)
	LibInfo = {}
	for lib in libs
		print("<b>[<color=#FAFF00>!</color>] Scanning and overflowing Lib : <color=#FAFF00>"+lib.name+"</color>")
		metalib = metaxploit.load(lib.path)
		VulAddress = metaxploit.scan(metalib)
		for address in VulAddress
			TotalResultAddress = {}
			ViaVul = [0,0]
			for exname in metaxploit.scan_address(metalib, address).split("\n")
				if exname.indexOf("Unsafe") >= 0 then
					NamesVul = exname[exname.indexOf("<b>")+3:exname.indexOf("</b>")]
					ResultVul = metalib.overflow(address, NamesVul)
					if typeof(ResultVul) != "null" and typeof(ResultVul) != "shell" then 
						ViaVul[0] = ViaVul[0] + 1
					else if typeof(ResultVul) == "shell" then
						ViaVul[1] = ViaVul[1] + 1
					end if
				end if
			end for
			LibInfo[lib.name] = [VulAddress.len,ViaVul]
			clear_screen
		end for
	end for
	print("<b>[<color=#FAFF00>!</color>] Scanned Vulnerabilitys: ")
	for lib in LibInfo
		print("<b>[<color=#FAFF00>!</color>] Lib : "+ lib["key"])
		print("<b>		[<color=#FAFF00>!</color>] Vulnerable Address : <color=#FAFF00>"+ lib["value"][0]+"</color>")
		print("<b>		[<color=#FAFF00>!</color>] Soft Vulnerabilitys : <color=#FAFF00>"+ lib["value"][1][0]+"</color>")
		print("<b>		[<color=#FF005C>-</color>] Dangerous Vulnerabilitys : <color=#FF005C>"+ lib["value"][1][1]+"</color>")
	end for
end function
//Scan or exit
if ScanR == "y" then
	//Update to Upgrade
	aptclient.update
	clear_screen
	print("<b>[<color=#68FF00>+</color>] Libraries Upgraded : ")
	for Lib in LibList
		metalib = metaxploit.load(Lib.path)
		upg = aptclient.check_upgrade(Lib.path)
		if upg == 1 then
			up = aptclient.install(Lib.name)
		else
			up = 0
		end if
		if up then
			print("<b>	[<color=#68FF00>+</color>] Lib : <color=#FAFF00>"+ metalib.lib_name +"</color> -> <color=#68FF00> Upgraded </color>")
		else
			print("<b>	[<color=#FF005C>-</color>] Lib : <color=#FAFF00>"+ metalib.lib_name +"</color> -> <color=#FF005C> No Upgrades </color>")
		end if
	end for
	ScanR = ""
	while (ScanR != "y") and (ScanR != "n")
		ScanR = user_input("<b>[<color=#FAFF00>!</color>] Scan Libraries ? (Y/N) : ").lower
	end while
	if ScanR == "y" then
		ScanLib(LibList)
	else
		exit("")
	end if
else
	ScanR = ""
	while (ScanR != "y") and (ScanR != "n")
		ScanR = user_input("<b>[<color=#FAFF00>!</color>] Scan Libraries ? (Y/N) : ").lower
	end while
	if ScanR == "y" then
		ScanLib(LibList)
	else
		exit("")
	end if
end if