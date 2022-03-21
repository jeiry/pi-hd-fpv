# PHFC

这个项目会集成fpv和控制功能，所以我叫这个项目做 PHFC吧。pi hd fpv and controll

这是beta版，还有很多Bug，如果有什么问题，可以到issues留言给我。

支持树莓派 3/3b/4b(实测)/cm3/cm4(实测)/zero2

详细视频 https://www.bilibili.com/video/BV1dR4y1L7yq

cm4可以到60fps、树莓派只支持h264编码。

服务器端使用的是 rtsp-simple-server

推流使用的是 gstreamer

### 更新内容

2022/03/04 添加srt caller 模式

2022/02/28 支持rtsp 支持srt listener模式

### step 1
```
cd /home/pi
wget https://raw.githubusercontent.com/jeiry/pi-hd-fpv/main/script.sh
chmod -R 777 script.sh
```
或
```
cd /home/pi
wget https://gitee.com/jeiry/pi-hd-fpv/raw/main/script.sh
chmod -R 777 script.sh
```

### step 2
```
./script.sh
```

### step 3

重启
```
reboot
```

### step 4

访问  http://your-ip:777/

## EC20 PCIE转USB网卡

把网卡设置为ECM模式自动拨号

以下命令查看USB网卡有没有插好，USB2.0已经足够。

```
ls /dev/tty* 
```
看到有 /dev/ttyUSB2 就代表usb已经正确插入并检测出来。

设置ECM模式 一行一行输入。每输入一行都会返回 OK 。
```
cat /dev/ttyUSB2 & echo -e "AT+QCFG=\"usbnet\",1\r\n" > /dev/ttyUSB2 
cat /dev/ttyUSB2 & echo -e "AT+CFUN=1,1\r\n" >/dev/ttyUSB2
```
设置中国电信4G APN
电信：名称ctlte，用户名ctnet@mycdma.cn，密码vnet.mobi
移动：名称cmnet
联通：名称uninet

```
cat /dev/ttyUSB2 & echo -e "AT+CGDCONT=1,\"IP\",\"ctlte\",\"ctnet@mycdma.cn\",\"vnet.mobi\"\r\n" > /dev/ttyUSB2
cat /dev/ttyUSB2 & echo -e "AT+CGACT=1,1\r\n" > /dev/ttyUSB2
cat /dev/ttyUSB2 & echo -e "AT+CFUN=1,1\r\n" >/dev/ttyUSB2

```
然后重启 非必须
```
reboot
```

重启后输入
```
ifconfig
```
看到 usb0这个网卡，并且inet上有ip 192.168.x.x 代表已经联网成功

ping 测试
```
ping -I usb0 www.baidu.com
```
使用usb0这个网卡ping百度。能ping通就是成功了。

## 把树莓派变成AP

开源库 https://github.com/RaspAP/raspap-webgui

把树莓派变成AP（可以理解为一个路由）的目的是你在外面，用USB网卡上网。你无法连接到web去设置。所以这个时候，你可以用手机wifi连接到树莓派AP上，打开 http://10.3.141.1:777/ 就能进入web配置推流到外网服务器。

因为墙的问题，你可能要重装好几次才能安装成功。
