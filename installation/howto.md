Download:
http://www.alexpage.de/download/usbit/usbit.zip
http://files2.linuxsystems.it/raspbian_wheezy_20130923.img.7z
https://gist.github.com/adammw/3245130

use usb-image-tool to restore image file to your SD card
--> restore

SD -> Rpi

login with 
root:raspberry

```
fdisk -cu /dev/mmcblk0
```
Then delete partitions with d and create a new with n. You can view the existing table with p.
p to see the current start of the main partition
d, 3 to delete the swap partition
d, 2 to delete the main partition
n p 2 to create a new primary partition, next you need to enter the start of the old main partition and then the size (enter for complete SD card). The main partition on the Debian image from 2012-04-19 starts at 157696, but the start of your partition might be different. Check the p output!
w write the new partition table
Now you need to reboot:
```
shutdown -r now
```
After the reboot you need to resize the filesystem on the partition. The resize2fs command will resize your filesystem to the new size from the changed partition table.
```
resize2fs /dev/mmcblk0p2
```
This will take a few minutes, depending on the size and speed of your SD card.
When it is done, you can check the new size with:
```
df -h
```

You will have to reconfigure your timezone after the first boot:
```
dpkg-reconfigure tzdata
```
The keyboard layout:
```
dpkg-reconfigure console-data
```
And the localization:
```
dpkg-reconfigure locales
```

```
apt-get install git nodejs nodejs-dbg npm
```


Details:

http://elinux.org/RPi_Resize_Flash_Partitions
http://www.alexpage.de/usb-image-tool/download/