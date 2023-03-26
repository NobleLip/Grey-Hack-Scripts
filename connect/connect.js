//grab cryto Library
cryptools = include_lib("/lib/crypto.so")
if not cryptools then exit("Error: Missing crypto library")
//Get Host and analyze networks
computer = get_shell.host_computer
devices = computer.network_devices
//Start and use wlan0 for monitor mode
cryptools.airmon("start", "wlan0")
networks = computer.wifi_networks("wlan0")
//Find the best Wifi to connect to
ToConnect = networks[0].split(" ")
for network in networks
	if network.split(" ")[1][0:-1].to_int > ToConnect[1][0:-1].to_int then
		ToConnect = network.split(" ")
	end if
end for
//Alert the user of the best wifi
print("<b>[<color=#68FF00>+</color>] Best Wifi :\n<b>     [<color=#68FF00>+</color>] BSSID : <color=#68FF00>"+ToConnect[0]+"\n<b>     [<color=#68FF00>+</color>] Power : <color=#68FF00>"+ToConnect[1]+"\n<b>     [<color=#68FF00>+</color>] ESSID : <color=#68FF00>"+ToConnect[2])
//Perform aireplay
print("<b>[<color=#FAFF00>!</color>]Performing Aireplay...")
print("<b>[<color=#FAFF00>!</color>]"+(300000/ToConnect[1][0:-1].to_int)+" ACK's Needed...")
cryptools.aireplay(ToConnect[0],ToConnect[2], (300000/ToConnect[1][0:-1].to_int))
print("<b>[<color=#68FF00>+</color>]<color=#68FF00> Sucess</color> - Aireplay recorded on file.cap")
//Perform aircrack and delete file.cap
print("<b>[<color=#FAFF00>!</color>] Trying to decipher file.cap key")
filecap = computer.File("file.cap")
key = cryptools.aircrack(filecap.path)
filecap.delete
//Stop wlan0 from monitor mode
cryptools.airmon("stop", "wlan0")
//Connect to Lan and Finish the Script
computer.connect_wifi("wlan0", ToConnect[0], ToConnect[2], key)
exit("<b>[<color=#68FF00>+</color>] Connected to the Wifi")
