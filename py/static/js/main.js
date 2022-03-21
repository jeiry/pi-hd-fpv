const app = {
    delimiters: ["((", "))"],
    data() {
        return {
            config: {},
            serverOn: false,
            serverUrl: "127.0.0.1",
            serverType: "local",
            resolution: "",
            streaming: "rtmp",
            streamPath: "streaming",
            bitrate: "2000000",
            fps: "30",
            audionbitrate: "320000",
            audionChannel: 2,
            audionCard: "mute",
            isStreaming: false,
            hostname: window.location.hostname,
            port: 1935,
            tempPort:1935,
            srtmode: 'listener',
            srtip: '',
            srtport: ''
        }
    },
    mounted: function () {
        this.fetchData();
        this.checkStreaming();
        setInterval(() => {
            this.checkStreaming();
        }, 2000);
    },
    methods: {
        fetchData() {
            var that = this
            axios({
                method: 'get',
                url: 'check'
            }).then(function (res) {
                if (res.data.code == 0) {
                    // this.config = res.data.data.Activeheight
                    that.config = res.data.data
                    console.log(that.config)
                    that.resolution = that.config.Activewidth + "x" + that.config.Activeheight
                    if (that.config.server == 'on') {
                        that.serverOn = true

                    } else {
                        that.serverOn = false
                    }
                }

            });
        },
        checkStreaming() {
            var that = this
            axios({
                method: 'get',
                url: 'streaming'
            }).then(function (res) {
                if (res.data.code == 0) {
                    if (res.data.data == true) {
                        that.isStreaming = true
                    } else {
                        that.isStreaming = false
                    }
                }

            });
        },
        stopStreaming() {
            var that = this
            axios({
                method: 'get',
                url: 'stopstreaming'
            }).then(function (res) {
                if (res.data.code == 0) {
                    that.isStreaming = false
                }

            });
        },
        server() {
            var that = this
            var action = that.serverOn == true ? 'off' : 'on'
            axios({
                method: 'get',
                url: 'server?action=' + action
            }).then(function (res) {
                if (res.data.code == 0) {
                    that.fetchData()
                }

            });
        },
        changeServerType(event) {
            // var that = this
            var optionText = event.target.value;
            if (optionText == "local") {
                this.serverUrl = "127.0.0.1"
                this.port = this.tempPort
                this.streamPath = "streaming"
            } else {
                this.serverUrl = ""
            }
            console.log(optionText);
        },
        changeUrl(event) {
            var optionText = event.target.value;
            this.hostname = optionText
        },
        changePort(event) {
            var optionText = event.target.value;
            this.port = optionText
        },
        submit() {
            var that = this
            // serverUrl: "127.0.0.1",
            // serverType: "local",
            // resolution: "",
            // streaming: "rtmp",
            // bitrate: "2000000",
            // fps: "30",
            // rate: "4800",
            // audionChannel: 1
            if (this.srtmode == "caller") {
                if (this.srtip.length < 7 && this.srtport.length < 2) {
                    alert("请输入正确地址或端口")
                    return
                }
            }
            let data = {
                "serverUrl": this.serverUrl,
                "serverType": this.serverType,
                "resolution": this.resolution,
                "streaming": this.streaming,
                'streamPath':this.streamPath,
                "port": this.port,
                "bitrate": this.bitrate,
                "fps": this.fps,
                "rate": this.rate,
                "audionChannel": this.audionChannel,
                "audionbitrate": this.audionbitrate,
                "audionCard": this.audionCard,
                "video": this.config.video,
                "srtmode": this.srtmode,
                "srtip": this.srtip,
                "srtport": this.srtport,
            };
            axios.post(`submit`, data)
                .then(res => {
                    if (res.data.code == 0) {
                        that.isStreaming = true
                    }
                })
        },
        selectFormat: function (e) {
            var selected = e.target.options.selectedIndex
            console.log(selected)
            this.srtmode = 'listener'
            if (selected == 0) {
                this.streaming = "rtmp"
                this.streamPath = "/streaming"
                this.port = 1935
                this.tempPort = 1935
            } else if (selected == 1) {
                this.streaming = "rtsp"
                this.streamPath = "/streaming"
                this.port = 8554
                this.tempPort = 8554
                this.audionCard = 'mute'
            } else if (selected == 3) {
                this.streaming = "srt"
                this.streamPath = "?mode=caller&latency=0"
                this.port = 9999
                this.tempPort = 9999
            }
        },
        selectSrtMode: function (e) {
            var selected = e.target.options.selectedIndex
            if (selected == 0) {
                this.srtmode = 'listener'
                this.streamPath = "?mode=caller&latency=0"
            } else if (selected == 1) {
                this.srtmode = 'caller'
                this.streamPath = ""
            }
        }
    }
}
Vue.createApp(app).mount("#app");