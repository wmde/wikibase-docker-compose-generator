# Webpack-Service
## Description
The installer is a small script to put a webpack application to systemctl and perform autoupdates
## Requirements
Before you can run the install.py you need to install (if it's not allready done) python3. Also the script need a package called 'python-crontab', which you can install by:\
sudo pip3 install python-crontab\
Be aware that the autoupdate are performed via crontab, therefore the program take the crontab of the use, which called that script. Also the script need at some parts admin rights.
## Use
The script takes 3 to 5 arguments, for a detailed description just run:\
python3 $PATH\_TO\_SCRIPT/install.py -h\
Basiclly you just need to call:\
python3 $PATH\_TO\_SCRIPT/install.py -s MY\_SERVICE -p PATH\_TO\_WEBPACK\_APPLICATION -i PATH\_TO\_INSTALL\_SCRIPTS\
Then the application will be added to systemctl tab with the name given of MY\_SERVICE, run 'npm run dev' to call the application and will autoupdate every week.\
If you want to adjust the update duration you can run:
python3 $PATH\_TO\_SCRIPT/install.py -s MY\_SERVICE -p PATH\_TO\_WEBPACK\_APPLICATION -i PATH\_TO\_INSTALL\_SCRIPTS -d MY\_DURATION\
For MY\_DURATION you can use for example dayly (or short d) for other possibilities you can take a look on [ububuntu man page](https://wiki.ubuntuusers.de/Cron/). Be aware the key word annually is not possible. You can also use numeric values.\
If you do not want to use autoupdates just use:\
python3 $PATH\_TO\_SCRIPT/install.py -s MY\_SERVICE -p PATH\_TO\_WEBPACK\_APPLICATION -i PATH\_TO\_INSTALL\_SCRIPTS -n\
If you want to adjust the webpack application call you can use:\
python3 $PATH\_TO\_SCRIPT/install.py -s MY\_SERVICE -p PATH\_TO\_WEBPACK\_APPLICATION -i PATH\_TO\_INSTALL\_SCRIPTS -c "not\_dev\_cmd"\
so the script will npm run not\_dev\_cmd as service call
