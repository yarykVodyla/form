<template>
    <div class="video-block-inner">
        <div class="over"></div>
        <div id="youtube-insert" class="youtube-insert"></div>
    </div>
</template>

<script>
    export default {
        name: "Video",
        data() {
            return {
                tag: null,
                firstScriptTag: null,
                player: null
            }
        },
        created() {
            // console.log('Video working');
            if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
                this.tag = document.createElement('script');
                this.tag.src = "https://www.youtube.com/iframe_api";
                this.firstScriptTag = document.getElementsByTagName('script')[0];
                this.firstScriptTag.parentNode.insertBefore(this.tag, this.firstScriptTag);
            }
            this.step();
        },
        methods: {
            step() {
                if (typeof (YT) == 'undefined' || typeof (YT.Player) == 'undefined') {
                    requestAnimationFrame(this.step);
                } else {
                    this.onYouTubeIframeAPIReady();
                }
            },
            onYouTubeIframeAPIReady() {
                this.player = new YT.Player('youtube-insert', {
                    height: this.$parent.videoHeight || '360',
                    width: '100%',
                    videoId: this.$parent.videocode,
                    events: {'onReady': this.onPlayerReady},
                    playerVars: {controls: 0, loop: 1, modestbranding: 1, rel: 0, showinfo: 0}
                });
            },
            onPlayerReady() {
                let overElements = document.getElementsByClassName("over");
                let _player = this.player;
                if (overElements.length > 0) {
                    for (let i = 0; i < overElements.length; i++) {
                        overElements[i].onclick = function (e) {
                            if (_player.getPlayerState() !== 1 && _player.getPlayerState() !== '1') {
                                _player.playVideo();
                            } else {
                                _player.pauseVideo();
                            }
                        }
                    }
                }
            }
        }
    }
</script>

<style>
    video {
        /*width: 100%;*/
        /*max-width: 100%;*/
        /*height: auto;*/
    }
    .video {
        position: relative;
    }
    .video-block-inner {
        width: 100%;
        position: relative;
        text-align: center;
        line-height: 0;
    }
    iframe {
        width: 100%;
        margin: auto;
    }
    .over {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 91;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .play-btn {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 87%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3
    }

    @media screen and (max-width: 768px) {
        .play-btn {
            opacity: 0;
            display: none
        }
    }

    .play-btn:before {
        content: '';
        display: block;
        width: 26%;
        background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDggNDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOm5vbmU7fQ0KCS5zdDF7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8Zz4NCgk8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+DQoJPHBhdGggaWQ9InN2Z18xIiBjbGFzcz0ic3QwIiBkPSJNLTgzOC0yMjMySDU2MnYzNjAwSC04MzhWLTIyMzJ6Ii8+DQoJPHBhdGggaWQ9InN2Z18yIiBjbGFzcz0ic3QxIiBkPSJNMTYsMTB2MjhsMjItMTRMMTYsMTB6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==) no-repeat;
        height: 48%;
        background-size: contain;
        cursor: pointer;
        transition: .3s
    }

    .play .play-btn:before {
        opacity: 0
    }

    @media screen and (max-width: 992px) {
        .video-block-inner, iframe {
            max-height: 350px;
        }

    }

    @media screen and (max-width: 768px) {
        .video-block-inner, iframe {
            max-height: 250px;
        }
    }

    @media screen and (max-width: 562px) {
        .video-block-inner, iframe {
            max-height: 180px;
        }
    }
</style>
