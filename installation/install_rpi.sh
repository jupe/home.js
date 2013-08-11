# Usage:
# wget https://github.com/jupe/home.js/blob/master/installation/rpi.sh
# chmod u+x rpi.sh
# ./rpi.sh

INSTALLDIR=/home/pi/home.js
SYMLINKDIR=/opt/home.js

echo -e "\033[36m INSTALLING HOME.JS SERVER APPLICATION \033[0m"

echo -e "\033[36m*preparing to Install..\033[0m"
sudo mkdir -p /opt/mongo    || exit 0
sudo mkdir -p /opt/mongo/bin || exit 0
sudo mkdir -p /opt/mongo/logs  || exit 0
sudo mkdir -p /data/db || exit 0
sudo chmod a+rw /opt/mongo/logs  || exit 0

debInst()
{
    dpkg-query -Wf'${db:Status-abbrev}' "${1}" 2>/dev/null | grep -q '^i'
}
notExists()
{
    test ! -f $1
}
exists()
{
    test -f $1
}

preconfigureUSB9097()
{
    echo 'condfigure usb9097...'
}

if debInst "git"; then
    echo "*git already installed - ok"
else
    echo -e "\033[36m Install git (this takes time)\033[0m"
    sudo apt-get install git -y
fi

if debInst "screen"; then
    echo "*screen already installed - ok"
else
    echo -e "\033[36m Install screen\033[0m"
    sudo apt-get install screen -y
fi

if debInst "nodejs"; then
    echo "*node.js already installed - ok"
    if notExists "/usr/bin/node"; then
        sudo ln -s /usr/bin/nodejs /usr/bin/node
    fi
else
    echo -e "\033[36m Install node.js (this takes time)\033[0m"
    sudo apt-get install nodejs -y
    sudo ln -s /usr/bin/nodejs /usr/bin/node
fi

if debInst "npm"; then
    echo "*npm already installed - ok"
else
    echo -e "\033[36m Install npm\033[0m"
    sudo apt-get install npm -y
fi


if debInst "owfs"; then
    echo "*owfs already installed - ok"
else
    echo -e "\033[36m Install owfs\033[0m"
    sudo apt-get install owfs -y
    
    echo -e "\033[36m Do you have USB9097 usb stick? \033[0m"
    select yn in "Yes" "No"; do
    case $yn in
        Yes ) preconfigureUSB9097;;
        No ) break;;
    esac
    done
fi

if [ -d "home.js" ]; then
    echo -e "\033[36mLooks that you have already installed homejs \033[0m"
    echo "Would u like to just update it?"
    select yns in "Yes" "No" "Skip"; do
    case $yns in
        Yes ) cd $INSTALLDIR;git pull origin master;exit;;
        No ) exit;;
        Skip ) break;;
    esac
    done
else    
    echo -e "\033[36m*Download home.js files \033[0m"
    cd
    git clone https://github.com/jupe/home.js.git || exit 0
    ln -s $INSTALLDIR $SYMLINKDIR
    sudo cp  home.js/bin/rpi/etc/init.d/homejs /etc/init.d || exit 0
    sudo chmod a+x /etc/init.d/homejs  || exit 0
    sudo update-rc.d homejs defaults
fi


if notExists "/opt/mongo/bin/bsondump"; then
   echo -e "\033[36m*Download mongodb binaries \033[0m"
   sudo cp home.js/bin/rpi/usr/bin/bsondump /opt/mongo/bin || exit 0
   sudo chmod a+x /opt/mongo/bin/bsondump /opt/mongo/bin || exit 0
   
fi
if notExists "/opt/mongo/bin/mongo"; then
   sudo cp home.js/bin/rpi/usr/bin/mongo /opt/mongo/bin || exit 0
   sudo chmod a+x /opt/mongo/bin/mongo  || exit 0
fi
if notExists "/opt/mongo/bin/mongod"; then
   sudo cp home.js/bin/rpi/usr/bin/mongo/bin/mongod /opt/mongo/bin || exit 0
   sudo chmod a+x /opt/mongo/bin/mongod  || exit 0
fi
if notExists "/opt/mongo/bin/mongodump"; then
   sudo cp home.js/bin/rpi/usr/bin/mongo/bin/mongodump /opt/mongo/bin || exit 0
   sudo chmod a+x /opt/mongo/bin/mongodump  || exit 0
fi

if notExists "/etc/init.d/mongod"; then
   echo -e "\033[36m*Install mongodb init scripts \033[0m"
   #Copy mongod init script
   sudo cp home.js/bin/rpi/etc/init.d/mongod /etc/init.d || exit 0
   #execution access
   sudo chmod a+x /etc/init.d/mongod  || exit 0
   #Autostart when power up
   sudo update-rc.d mongod defaults
   
   # another way to add /etc/rc.d/rc.local
   ### Mongodb configuration
   # /usr/local/mongodb/bin/mongod --config /etc/mongodb.conf
fi

myip=`ifconfig | grep -v '127.0.0.1' | sed -n 's/.*inet addr:\([0-9.]\+\)\s.*/\1/p'`

echo -e "\033[36m*Install dependencies \033[0m"
#sudo npm install -g node-dev         || exit 0
npm install $INSTALLDIR/ || exit 0
echo -e "\033[36m*Start mongodb \033[0m"
sudo /etc/init.d/mongod started

echo "Check that this mongod is running with browser: "
echo "http://"$myip":28017"
echo -e "\033[36m*Starting homejs \033[0m"
echo "npm start"
npm start
echo -e "\033[36m INSTALLATION COMPLETE :)"
echo -e "Start use web pages: http://"$myip":3000 \033[0m"
echo -e "Application started background"

