#Noble Scripts
## Feel free to use any of my scripts to make your game better!

Hi! I'm Noble. Feel free to contact me in order to get scripts that I cannot make public!

## Scripts

I will categorize the game scripts in 2:

- Usefull : **What you will use to hack and monitor your servers**
- Better Game Experience : **Provide the game information in a better way**
  <br/><br/>

|         | Usefull            | Better Game Experience |
| ------- | ------------------ | ---------------------- |
| whois   | :x:                | :heavy_check_mark:     |
| connect | :heavy_check_mark: | :x:                    |

<br/>

### whois

This script only provides the information of whois in a better way.\
You can see in the image both the Grey Hack whois script and my whois script
<br/><br/>

![image](whois/newwhois.PNG)

### connect

This script will pick the best network available. After that, it will run aireplay, with the best network and the right packets. \
To din the right packets, I used this table:

![image](connect/PacketsInf.png)

At first, I thought about using this table and use polynomial interpolation using the Newton method to find the right equation to calculate the perfect value of packets, until I realize that all I have to do is:

$$
Packets = {300 000 \over X\% }
$$

It's as simple as that.

Once aireplay is done, it will use the file.cap , decipher the password and connect to the wifi, deleting the file.cap and closing the script!

![image](connect/Result.PNG)
