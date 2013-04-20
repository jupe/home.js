# HOME.JS INSTALLATION INTRODUCTIONS

## Debian based systems, e.g. wheezy ( Raspberry Pi )

    sudo apt-get update
    sudo apt-get install git owserver owhttpd
    sudo apt-get install mongodb (there is no package for rpi wheezy)

    
    // fetch new node.js
    wget https://gist.github.com/adammw/3245130/raw/c3538c646f6fc2036635829d4793707681680a2f/v0.10.0/node-v0.10.0-linux-arm-armv6j-vfp-hard.tar.gz
    // unzip it
    tar xzvf node-*
    //and copy files to usr folder
    sudo cp node-*/bin/* /usr/bin/
    sudo cp node-*/lib/* /usr/lib/
    
    // install nod
    sudo npm install -g node-dev
    git clone https://github.com/jupe/home.js.git
    cd home.js/src
    npm install
    npm start > log/app.log


## Arclinux

    pacman -S nodejs mongodb git
    systemctl start mongodb
    systemctl enable mongodb
    npm install -g node-dev
    git clone https://github.com/jupe/home.js.git
    cd home.js/src
    npm install
    npm start > log/app.log

* https://wiki.archlinux.org/index.php/MongoDB
* https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
