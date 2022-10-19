//Include Crypto.so
cryptools = include_lib("/lib/crypto.so")
if not cryptools then exit("Error: Missing crypto library")
//Params
if params.len != 1 and params.len != 2 or params[0] == "-h" then exit("<b>[<color=#FF005C>-</color>] If is File : -f NameFile, If not just copy paste contents")
//Not File Deciphering tool function
NotFile = function(info)
	contents = info.split("\n")
	clear_screen
	for credent in contents
		info = credent.split(":")
		print("<b>[<color=#FAFF00>!</color>] Trying to deciper "+info[0]+" Password:")
		password = cryptools.decipher(info[1])
		print("<b><b>[<color=#68FF00>+</color>] <color=#68FF00>"+info[0]+"</color> Password : <color=#68FF00>"+password+"</color>")
	end for
end function
//File Deciphering Tool
IsFile = function(namefile)
	file = get_shell.host_computer.File(namefile).get_content
	for credent in file.split("\n")
		credent = credent.split(":")
		print("<b>[<color=#FAFF00>!</color>] Trying to deciper "+credent[0]+" Password:")
		password = cryptools.decipher(credent[1])
		print("<b><b>[<color=#68FF00>+</color>] <color=#68FF00>"+credent[0]+"</color> Password : <color=#68FF00>"+password+"</color>")
	end for
end function
//If Len is == 2 is a file
if params.len == 2 then
	if typeof(get_shell.host_computer.File(params[1])) != "file" then exit("<b>[<color=#FF005C>-</color>] File not Found!")
	IsFile(params[1])
else
	NotFile(params[0])
end if