#!/usr/bin/env bash
sudo apt -y upgrade && apt update
sudo apt-get -y install vim
sudo apt-get -y install libgstreamer1.0-dev
sudo apt-get -y install libgstreamer-plugins-bad1.0-dev
sudo apt-get -y install gstreamer1.0-plugins-ugly
sudo apt-get -y install gstreamer1.0-tools
sudo apt-get -y install gstreamer1.0-gl
sudo apt-get -y install gstreamer1.0-gtk3
sudo apt-get -y install gstreamer1.0-plugins-good
sudo apt-get -y install gstreamer1.0-plugins-bad
sudo apt-get -y install gstreamer1.0-alsa
sudo apt-get -y install gstreamer1.0-libav
sudo apt-get -y apt install gstreamer1.0-rtsp
sudo apt-get -y install python3-pip
sudo apt-get -y install libatlas-base-dev
sudo apt-get -y install git
git clone https://github.com/jeiry/pi-hd-fpv.git
sudo pip3 install flask
sudo pip3 install numpy
wget http://github.com/aler9/rtsp-simple-server/releases/download/v0.17.16/rtsp-simple-server_v0.17.16_linux_armv7.tar.gz
tar -zxvf rtsp-simple-server_v0.17.16_linux_armv7.tar.gz
sudo apt-get -y install nginx
wget http://github.com/fatedier/frp/releases/download/v0.39.1/frp_0.39.1_linux_arm.tar.gz
tar -zxvf frp_0.39.1_linux_arm.tar.gz
sed -i "/^exit 0/i\python3 /home/pi/pi-hd-fpv/py/main.py &" /etc/rc.local
echo '
dtoverlay=tc358743 
dtoverlay=cma,cma-128
dtoverlay=tc358743-audio
'>>/boot/config.txt
echo "00ffffffffffff005262888800888888
1c150103800000780aEE91A3544C9926
0F505400000001010101010101010101
010101010101011d007251d01e206e28
5500c48e2100001e8c0ad08a20e02d10
103e9600138e2100001e000000fc0054
6f73686962612d4832430a20000000FD
003b3d0f2e0f1e0a2020202020200100
020321434e041303021211012021a23c
3d3e1f2309070766030c00300080E300
7F8c0ad08a20e02d10103e9600c48e21
0000188c0ad08a20e02d10103e960013
8e210000188c0aa01451f01600267c43
00138e21000098000000000000000000
00000000000000000000000000000000
00000000000000000000000000000000" > edid.txt

