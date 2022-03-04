# -*- coding: utf-8 -*
import os
import time
import numpy as np
from flask import Flask, request, render_template, redirect, url_for,current_app
import threading
import json
import sys
from importlib import reload
reload(sys)
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check')
def check():
    os.popen("v4l2-ctl --set-edid=file=/home/pi/edid.txt --fix-edid-checksums")
    config = os.popen("v4l2-ctl --query-dv-timings")
    os.system("v4l2-ctl --set-dv-bt-timings query")
    # 输入信息
    config = config.read().split("\n\t")
    dict = {}
    for obj in config:
        obj_ = obj.replace("\t","").split(": ")
        dict[obj_[0].replace(" ","")] = obj_[1]
    config = os.popen("v4l2-ctl --list-devices")
    # device 号
    config = config.read()
    findString = config.find(".csi):")
    if findString != -1:
        for obj in config[findString:].split("\n\t"):
            if obj.find("video") != -1:
                dict['video'] = obj
    config = os.popen("ps ax|grep rtsp")
    # 服务器状态
    config = config.read().split("\n")
    dict['server'] = "off"
    for obj in config:
        if obj.find('rtsp-simple-server') != -1:
            serverid = [i for i in obj.split(" ") if i != '']
            dict['server'] = 'on'
            # dict['serverid'] = serverid[0]
            break
    config = os.popen("arecord -l")
    # 声卡
    config = config.read().split("\n")
    audioCard = [{"value":"mute","name":"Mute","selected":True}]
    for obj in config:
        if obj.find('card') != -1:
            explode = obj.split(":")
            card = explode[0].split(' ')
            audioCard.append({"value":"hw:%s"%card[1],"name":explode[1],"selected":False})
            # print(explode[0].split(' '),explode[1])
    # print(config)
    dict['audiocard'] = audioCard
    return json.dumps({'code':0,"data":dict})

def startServer():
    print('rtsp-simple-server')
    os.system("/home/pi/rtsp-simple-server /home/pi/rtsp-simple-server.yml")

@app.route('/server', methods=['GET'])
def server():
    arg = request.args.get("action")
    if arg == "off":
        config = os.popen("ps ax|grep rtsp")
        config = config.read().split("\n")

        print("===", config)
        for obj in config:
            if obj.find('rtsp-simple-server') != -1:
                serverid = [i for i in obj.split(" ") if i != '']
                os.system("kill -9 %s"%serverid[0])
    elif arg == "on":
        # t = threading.Thread(target=startServer, args=())
        # t.start()
        os.system("nohup /home/pi/rtsp-simple-server /home/pi/rtsp-simple-server.yml &")
    return json.dumps({'code':0})

@app.route('/submit', methods=['POST'])
def submit():
    data = json.loads(request.get_data(as_text=True))
    print(data)
    resolution = data['resolution'].split("x")
    if data['streaming'] == 'rtmp' :
        pipelineBase = [
            'gst-launch-1.0',
            '-vvv',
            'v4l2src',
            "device=%s !"%data['video'],
            '"video/x-raw,width=%s,height=%s,framerate=%s/1,format=UYVY" !'%(resolution[0],resolution[1],data['fps']),
            'v4l2h264enc',
            'extra-controls="controls,h264_profile=4,h264_level=13,video_bitrate=%s;" !'%data['bitrate'],
            '"video/x-h264,profile=high, level=(string)4.2" !',
            'h264parse !',
            'queue !',
            'flvmux streamable=true name=mux !',
            'rtmpsink location="rtmp://%s:%s/streaming"'%(data['serverUrl'],data['port'])
        ]
        pipelineAudio = [
            'alsasrc device=%s !'%data['audionCard'],
            'audio/x-raw,rate=48000,channels=%s !'%data['audionChannel'],
            'audioconvert !',
            'avenc_aac bitrate=%s !'%data['audionbitrate'],
            'aacparse !',
            'queue !',
            'mux.'
        ]
    elif data['streaming'] == 'rtsp' :
        pipelineBase = [
            'gst-launch-1.0 -vvv v4l2src ! '
            '"video/x-raw,width=%s,height=%s,framerate=%s/1,format=UYVY" !'%(resolution[0],resolution[1],data['fps']),
            'v4l2h264enc extra-controls="controls,h264_profile=4,h264_level=13,video_bitrate=%s;" !'%data['bitrate'],
            '"video/x-h264,profile=high, level=(string)4.2" ! '
            'h264parse  ! '
            'rtspclientsink name=s location="rtsp://%s:%s/streaming"'%(data['serverUrl'],data['port'])
        ]
    elif data['streaming'] == 'srt' :
        url = ''
        port = data['port']
        if data['srtmode'] == 'caller':
            url = data['srtip']
            port = data['srtport']
        pipelineBase = [
            'gst-launch-1.0 -vvv v4l2src ! '
            '"video/x-raw,width=%s,height=%s,framerate=%s/1,format=UYVY" !'%(resolution[0],resolution[1],data['fps']),
            'v4l2h264enc extra-controls="controls,h264_profile=4,h264_level=10,video_bitrate=%s;" !'%data['bitrate'],
            '"video/x-h264,profile=high, level=(string)4.2" ! '
            'mpegtsmux name=mux ! '
            'srtsink uri=srt://%s:%s/ latency=50 '%(url,port)
        ]
        pipelineAudio = [
            'alsasrc device=%s !'%data['audionCard'],
            'audio/x-raw,rate=48000,channels=%s !'%data['audionChannel'],
            'audioconvert ! avenc_aac bitrate=%s !'%data['audionbitrate'],
            'aacparse ! queue ! mux.'

        ]
    if data['audionCard'] != 'mute':
        arr = np.append(pipelineBase,pipelineAudio)
    else :
        arr = pipelineBase
    print(" ".join(arr))
    command = "nohup %s &"%" ".join(arr)
    os.system(command)
    return json.dumps({'code': 0})

@app.route('/streaming', methods=['GET'])
def streaming():
    config = os.popen("ps ax|grep gst-launch-1.0")
    config = config.read().split("\n")
    data = False
    for obj in config:
        if obj.find('gst-launch-1.0 -vvv') != -1:
            # serverid = [i for i in obj.split(" ") if i != '']
            # print(obj,'---',serverid)
            data = True
    return json.dumps({'code': 0,'data':data})

@app.route('/stopstreaming', methods=['GET'])
def stopstreaming():
    config = os.popen("ps ax|grep gst-launch-1.0")
    config = config.read().split("\n")
    data = False
    for obj in config:
        if obj.find('gst-launch-1.0 -vvv') != -1:
            pid = [i for i in obj.split(" ") if i != '']
            os.system("kill -9 %s" % pid[0])
    return json.dumps({'code': 0, 'data': data})
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=776)
