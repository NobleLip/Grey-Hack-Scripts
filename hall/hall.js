clear_screen
//Get IP and check if its valid
if params.len != 1 or params[0] == "-h" or params[0] == "--help" then exit(command_info("nmap_usage"))	
if not is_valid_ip(params[0]) then exit("<b>[<color=#FF005C>-</color>] Invalid ip address")
if not get_shell.host_computer.is_network_active then exit("<b>[<color=#FF005C>-</color>] Connect to Internet")
//Check if it is Lan or Public
isLan = is_lan_ip(params[0])
if isLan then
   router = get_router;
else 
   router = get_router(params[0])
end if
if router == null then exit("<b>[<color=#FF005C>-</color>] IP Address not Found")
if not isLan then
   ports = router.used_ports
else
   ports = router.device_ports(params[0])
end if
if ports == null then exit("<b>[<color=#FF005C>-</color>] IP Address not Found")
if typeof(ports) == "string" then exit(ports)
//Function to correct info
InfoOrg = function(info)
	NewInfo = []
	info = info.split(char(10))
	for i in info
		NewInfo = NewInfo + [i.split(" ")]
	end for
	NewInfo.remove(0)
	return NewInfo
end function
//If it did get Ports now we Print them in a better way
info = "<b>OPT PORT STATE SERVICE VERSION LAN "+char(10)
info = info + "<b>"+"0"+ " "+"0"+ " " + "open"+ " " + "kernel_router "+router.kernel_version + " " + router.port_info + "192.168.0.1"+char(10)  
Opt = 1
if ports.len > 0 then
	for port in ports
   		service_info = router.port_info(port)
  		lan_ips = port.get_lan_ip
   		port_status = "open"
   		if(port.is_closed and not isLan) then
      		port_status = "closed"
   		end if
   		info = info + "<b>"+ Opt+ " "+port.port_number + " " + port_status+ " " + service_info + " " + lan_ips+" "+char(10)
		Opt = Opt + 1
	end for
end if
print(format_columns(info))
info = InfoOrg(info)
Opt = " "
while((typeof(Opt)!="number") or (Opt < 0) or (Opt > (info.len-2)))
	Opt = user_input("<b>[<color=#FAFF00>!</color>] Pick the Option : ").to_int
end while
clear_screen
//Now find Vulnerabilitys in the port
metaxploit = include_lib("/lib/metaxploit.so")
if not metaxploit then
    metaxploit = include_lib(current_path + "/metaxploit.so")
end if
if not metaxploit then exit("<b>[<color=#FF005C>-</color>] Error: Can't find metaxploit library")
net_session = metaxploit.net_use(params[0], info[Opt][1].to_int)
if not net_session then exit("<b>[<color=#FF005C>-</color>] Error: can't connect to net session")
metaLib = net_session.dump_lib
//Search for Memory Vurnerabilitys
print("<b>[<color=#68FF00>+</color>] IP :<color=#68FF00> "+params[0]+"</color> PORT :<color=#68FF00> "+info[Opt][1].to_int+"</color>")
print("    <b>[<color=#68FF00>+</color>] Library :<color=#68FF00> "+info[Opt][3]+"</color> Version :<color=#68FF00> "+info[Opt][4]+"</color>\n")
print("<b>[<color=#FAFF00>!</color>] Exploring the Memory for Vulnerabilities...")
MemoryAdd = metaxploit.scan(metaLib)
//Scan Address, Get Names and vulnerability results
OverFlowResults = {}
for address in MemoryAdd
	TotalResultAddress = {}
	for exname in metaxploit.scan_address(metaLib, address).split("\n")
		if exname.indexOf("Unsafe") >= 0 then
			NamesVul = exname[exname.indexOf("<b>")+3:exname.indexOf("</b>")]
			ResultVul = metaLib.overflow(address, NamesVul)
			TotalResultAddress[NamesVul] = typeof(ResultVul)
		end if
	end for
	OverFlowResults[address] = TotalResultAddress
end for
//Function to print and pick all the vulnerabilitys
PrintVul = function(ip,port,lib,vers,info)
	clear_screen
	print("<b>[<color=#68FF00>+</color>] IP :<color=#68FF00> "+ip+"</color> PORT :<color=#68FF00> "+port+"</color>")
	print("    <b>[<color=#68FF00>+</color>] Library :<color=#68FF00> "+lib+"</color> Version :<color=#68FF00> "+vers+"</color>\n")
	Choose = [0,0]
	for address in info
		print("<b>(<color=#68FF00>"+Choose[0]+"</color>)[<color=#68FF00>+</color>] Address: <color=#68FF00>"+address["key"]+"</color> Vulnerabilitys:")
		Choose[1] = 0
		for vulnerability in address["value"]
			if vulnerability["value"] != "null" then
				AddRes = " [<color=#13F4EF>V</color>] <color=#13F4EF>"+vulnerability["value"]+"</color>"
			else
				AddRes = " [<color=#FF005C>X</color>] <color=#FF005C>Failed </color>"
			end if 
			print("		<b>(<color=#FAFF00>"+Choose[1]+"</color>)[<color=#FAFF00>!</color>] <color=#FAFF00>"+vulnerability["key"]+"</color>" + AddRes)
			Choose[1] = Choose[1] + 1 
		end for
		Choose[0] = Choose[0] + 1
	end for
end function
//Pick Vulnerability 
PickVul = function(info)
	print("\n\n<b>       ADDRESS VULNERABILITY ACTION (0=No,1=Yes)")
	ChooseVul = []
	while ChooseVul.len != 3
		ChooseVul = user_input("<b>OPTION : ").split(" ")
	end while
	ChooseAddName = ["","","",ChooseVul[2]]
	//If the action is diferent from yes or no
	if ChooseVul[2] > 1 or ChooseVul[2] < 0 then
		return null
	end if
	Choose = [0,0]
	for address in info
		Choose[1] = 0
		for vulnerability in address["value"]
			if (ChooseVul[0] == Choose[0]) and (ChooseVul[1] == Choose[1]) then
				ChooseAddName[0] = address["key"]
				ChooseAddName[1] = vulnerability["key"]
				ChooseAddName[2] = vulnerability["value"]
				return ChooseAddName
			end if
			Choose[1] = Choose[1] + 1 
		end for
		Choose[0] = Choose[0] + 1
	end for
	//If no condition is true
	return null
end function
//Function Computer get mail
ComputerTxtFiles = function(overflowresult)
	if overflowresult.File("/etc/passwd").get_content != null then
		print("<b>[<color=#68FF00>+</color>] Passwd ")
		print(overflowresult.File("/etc/passwd").get_content)
	for user in overflowresult.File("/home").get_folders
		for mail in overflowresult.File("/home/"+user.name+"/Config").get_files
			if mail.name == "Mail.txt" then
				print("<b>[<color=#68FF00>+</color>] Mail.txt ")
				print(mail.get_content)
			end if
		end for
	end for
end function
//Function to Get Mail, Bank and pswd file
GetTxtFiles = function(overflowresult)
	//Get Passwd Content
	while overflowresult.path != "/"
		overflowresult = overflowresult.parent
	end while 
	folders = overflowresult.get_folders
	for folder in folders
		if folder == "/etc" then
			files = folder.get_files
			for file in files
				if file.name == "passwd" then
					print("<b>[<color=#68FF00>+</color>] Passwd \n" + file.get_content)
				end if
			end for
		end if
	end for
	//Get Mail.txt Content
	while overflowresult.path != "/"
		overflowresult = overflowresult.parent
	end while 
	folders = overflowresult.get_folders
	for folder in folders
		if folder == "/home" then
			users = folder.get_folders
			for user in users
				for config in user.get_folders
					if config.name == "Config" then
						for mail in config
							if mail.name == "Mail.txt" then
								print("<b>[<color=#68FF00>+</color>] Mail.txt\n" + mail.get_content)
							end if
						end for
					end if
				end for
			end for
		end if
	end for
	print("<b>[<color=#68FF00>+</color>] Done Exploring Files!\n")
end function
//Loop to validate
while (1)
	PrintVul(params[0], info[Opt][1].to_int, info[Opt][3], info[Opt][4], OverFlowResults)
	RunVulnerability = PickVul(OverFlowResults)
	//Run Number Vulnerability
	if RunVulnerability[2] == "number" and RunVulnerability[3].to_int then
		metaLib.overflow(RunVulnerability[0], RunVulnerability[1], "root")
	end if
	//Run shell vulnerability
	if RunVulnerability[2] == "shell" and RunVulnerability[3].to_int then
		metaLib.overflow(RunVulnerability[0], RunVulnerability[1]).start_terminal
	end if
	//Run File Vulnerability
	if RunVulnerability[2] == "file" and RunVulnerability[3].to_int then
		GetTxtFiles(metaLib.overflow(RunVulnerability[0], RunVulnerability[1]))
	end if
	//Run Computer Vulnerability
	if RunVulnerability[2] == "computer" and RunVulnerability[3].to_int then
		ComputerTxtFiles(metaLib.overflow(RunVulnerability[0], RunVulnerability[1]))
	end if
	user_input()
end while
