# PHFC

这个项目会集成fpv和控制功能，所以我叫这个项目做 PHFC吧。pi hd fpv and controll

这是beta版，还有很多Bug，如果有什么问题，可以到issues留言给我。

支持树莓派 3/3b/4b(实测)/cm3/cm4(实测)/zero2

详细视频 https://www.bilibili.com/video/BV1dR4y1L7yq

cm4可以到60fps、树莓派只支持h264编码。

### 更新内容

2022/03/04 添加srt caller 模式

2022/02/28 支持rtsp 支持srt listener模式

### step 1
```
cd /home/pi
wget https://raw.githubusercontent.com/jeiry/pi-hd-fpv/main/script.sh
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
