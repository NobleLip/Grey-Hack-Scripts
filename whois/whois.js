EditInfo = function(info)
	info = info.split("\n")
	NewInf = []
	for i in info
		NewInf = NewInf + [i.split(":")]
	end for
	return NewInf
end function

Pretify = function(info)
	Spaces = [11,0,9,17]
	index = 0
	for i in info
		S = (" "*(Spaces[index]))
		print("<b>	" + i[0] +" : "+ S +"[<color=#68FF00>"+i[1][1:-1]+"</color>]</b>")
		index = index + 1
	end for
end function

//command: whois
if params.len != 1 or params[0] == "-h" or params[0] == "--help" then
	print(command_info("whois_usage"))
else
	address = params[0]
	info = EditInfo(whois(address))
	Pretify(info)
end if