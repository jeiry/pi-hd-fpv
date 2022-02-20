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
            bitrate: "2000000",
            fps: "30",
            audionbitrate: "320000",
            audionChannel: 2,
            audionCar: "mute",
            isStreaming: false,
            hostname: window.location.hostname,
            port: 1935
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
            } else {
                this.serverUrl = ""
            }
            console.log(optionText);
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
            let data = {
                "serverUrl": this.serverUrl,
                "serverType": this.serverType,
                "resolution": this.resolution,
                "streaming": this.streaming,
                "bitrate": this.bitrate,
                "fps": this.fps,
                "rate": this.rate,
                "audionChannel": this.audionChannel,
                "audionbitrate": this.audionbitrate,
                "audionCar": this.audionCar,
                "video": this.config.video,
            };
            axios.post(`submit`, data)
                .then(res => {
                    if (res.data.code == 0) {
                        that.isStreaming = true
                    }
                })
        }
    }
}
Vue.createApp(app).mount("#app");