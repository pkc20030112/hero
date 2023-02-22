/*

Livestream Plugin.
email: movileanuion@gmail.com 
Copyright 2022 by Vanea Young 
@version: 1.2.23
*/
'use strict';
/* Errors reporting: disabled
window.onerror = function(msg, url, lineNo, columnNo, error) {
    alert('msg ' + msg);
    alert('url ' + url);
    alert('lineno: ' + lineNo);
    alert('columnNo: ' + columnNo);
    alert('error: ' + error);
    return false;
}
*/ 
if (typeof __j == 'undefined') {
    var __j = function(a) {
        return $(a);
    };
}
Number.prototype.padLeft = function(base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}

var VY_LIVE_STREAM = function(o) {
    this.mediaStream = new MediaStream();
    this.mediaRecorder = null;
    this.ws;
    this.def_constraints = null;
    this.gl_mdevices = {
        c: null,
        a: null,
        v: null
    };
    this.videoTrack;
    this.audioTrack;
    this.filename;
    this.file_type = vy_lv_rec_type;
    this.lastClick = 0;
    this.im_host = 0;
    this.lastclick_delay = 1000;
    this.original_state = window.location.pathname;
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.soundVolume = 0.99;
    this.options = o;
    this.socket;
    this.body = __j(document.body);
    this.html = __j('html');
    this.head = __j('head');
    this.ajax_url = '/vy-livestream-cmd.php';
    this.vy_xhr = {};
    this.loverlay = null;
    this.is_live;
    this.page_id = 0;
    this.group_id = 0;
    this.webRtcPeer = null;
    this.localStream = null;
    this.video;
    this.live_option = 'standart';
    this.three_dots_loading = '#three-dots-loading';
    this.cnt;
    this.author = 0;
    this.btn_go;
    this.shouldFaceUser = true;
    this.can_stream_now = false;
    this.mob_init_countdown = false;
    this.current_min = 0;
    this.current_sec = 0;
    this.last_live_id;
    this.stream_video_started = 0;
    this.live_id = 0;
    this.broadcast_id = 0;
    this.is_live = 0;
    this.start_obs = 0;
    this.obs_stream = 0;
    this.mobselect = 0;
    this.countdown_seconds = 5;
    this.live_stopped;
    this.timer_stopped;
    this.cupertino_drawer = null;
    this.post_to_timeline = "no";
    this.navigator_permission_request;
    this.obs_stream_key_session_generated;
    this.obs_stream_p;
    this.camera_blocked;
    this.easy_timer;
    this.easy_timer2;
    this.im_muted;
    this.is_fullscreen;
    this.obs_stream_name = null;
    this.recordAudio;
    this.recordVideo;
    this.host_reconnected_stop_timer;
    this.flvPlayer = null;
    this.didEnterBeforeUnload;
    this.timer_interval;
    this.im_moderator;
    this.blocked_users = {};
    this.muted_users = {};
    this.peerConnection = {};
    this.peerConnections = {};
    this.mob_popups = {};
    this._intervals = {};
    this.config = {};
    this.golive_data = {
        'audience': 1,
        'description': '',
        'title': '',
        'record': vy_lv_recording ? 'yes' : 'no'
    };
    this.setTime = function() {};
    this.timeouts = {};
    this.host_reconnected_success = '<div id="vy_lv_hr_success" onclick="var _that1004w32 = this;__j(this).addClass(\'hide\');setTimeout(function(){__j(_that1004w32).remove()},1500);" class="vy_lv_host_reconnected_success"><i class="vy_lv_success_ic"></i>' + vy_lvst_lang.connected + '!</div>';
    this.host_reconnecting_warn = '<div class="vy_lv_host_view_reconnecting" id="vy_lv_hostr321"><div class="vy_lv_host_view_reconnecting_txt">' + vy_lvst_lang.reconnecting + '... <span id="host_reconnecting_timer">2:00</span></div></div>';
    this.camera_retry_markup = '<div id="vy_lv_a17cam_notfound_retry" class=" vy_lv_anim_zoom">\
                    <div class="vy_lv_a19camnt">' + vy_lvst_lang.unable_to_find_camera_or_mic + '</div>\
                    <div class="vy_lv_a20camnd">' + vy_lvst_lang.pls_verify_your_device_correct_perm_brows + ' <span class="js__vy-lv-camerr"></span></div>\
                    <div class="vy_lv_btn_retry_par"><button class="vy_lv_btn_retry_cam js__vy_lv_btn_retry_cam" onclick="event.preventDefault();vy_lvst.requestCam2();">' + vy_lvst_lang.retry + '</button></div>\
                    </div>';
    this.camera_notfound_markup = '<div id="vy_lv_a17cam_notfound" class="">\
                    <div class="vy_lv_a19camnt">' + vy_lvst_lang.allow_access_to_camera + '</div>\
                    <div class="vy_lv_a20camnd">' + vy_lvst_lang.your_browser_not_allow_live_producer + ' <span class="js__vy-lv-camerr"></span></div>\
                    <div class="vy_lv_btn_retry_par"><button class="vy_lv_btn_retry_cam js__vy_lv_btn_retry_cam" onclick="event.preventDefault();vy_lvst.requestCam2();">' + vy_lvst_lang.retry + '</button></div>\
                    </div>';




    this.comment_markup = '<div class="vy_lv_comment vy_lv_comm_uid_%user_id" onclick="vy_lvst.commentClick(this,event,%user_id);">\
                                <div class="vy_lv_comment2a"><img src="%avatar" border="0"/></div>\
                                <div class="vy_lv_comment_str3">\
                                <span class="vy_lv_comment3a js__comment_author">%user_name %moderator</span>\
                                <input type="hidden" class="__none js__comment_author_name" value="%user_name" />\
                                <div class="vy_lv_comment4_str">%comment</div>\
                                </div>\
                                </div>';

    this.comment_markup_author = '<div class="vy_lv_comment __author vy_lv_comm_uid_%user_id" onclick="vy_lvst.commentClick(this,event,%user_id);">\
                                <div class="vy_lv_comment2a"><img src="%avatar" border="0"/></div>\
                                <div class="vy_lv_comment_str3">\
                                <span class="vy_lv_comment3a js__comment_author">%user_name %moderator</span>\
                                <input type="hidden" class="__none js__comment_author_name" value="%user_name" />\
                                <div class="vy_lv_comment4_str">%comment</div>\
                                </div>\
                                </div>';
    this.comment_markup_moderator = '<div class="vy_lv_comment __moderator vy_lv_comm_uid_%user_id" onclick="vy_lvst.commentClick(this,event,%user_id);">\
                                <div class="vy_lv_comment2a"><img src="%avatar" border="0"/></div>\
                                <div class="vy_lv_comment_str3">\
                                <span class="vy_lv_comment3a js__comment_author">%user_name %moderator</span>\
                                <input type="hidden" class="__none js__comment_author_name" value="%user_name" />\
                                <div class="vy_lv_comment4_str">%comment</div>\
                                </div>\
                                </div>';
    this.notif_markup = '<div class="vy_lv_comment %class" onclick="vy_lvst.commentClick(this,event,%user_id);">\
                                <div class="vy_lv_comment2a">%ic</div>\
                                <div class="vy_lv_comment_str3">\
                                <span class="vy_lv_comment3a js__comment_author"><img class="vy_lvst_notif_avatar" src="%avatar" border="0" />&nbsp;%user_name</span>\
                                <div class="vy_lv_comment4_str">%text %by</div>\
                                </div></div>';



    // initialize the class
    this._init();

}

$.extend(VY_LIVE_STREAM.prototype, {
    evstop: function(e, p) {

        if (p) e.preventDefault();
        e.stopImmediatePropagation();

    },
    jajax: function(u, t, d, pForm, id, asyn) {

        const self = this;

        if (!id)
            id = Math.floor(Math.random() * 99);



        let req;
        if (!pForm) {
            let v = {
                url: u,
                type: t,
                data: d,
                beforeSend: function(jqXHR, settings) {

                    self.vy_xhr[id] = jqXHR;


                }
                //  cache true
            };

            if (asyn)
                v['async'] = false;

            req = $.ajax(v);

        } else {
            req = $.ajax({
                url: u,
                type: t,
                data: d,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });
        }
        req.fail(function(a, b) {

        });

        return req;

    },
    connect_to_server: function() {


        if (window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1') {

            console.log("%c" + vy_lvst_lang.connection_refused_on_localhost, "color: red; font-size:12px;");
        }
        if (location.protocol !== 'https:') {

            console.log("%c" + vy_lvst_lang.you_dont_have_ssl_enabled, "color: red; font-size:12px;");
        }
      
        return io.connect(vy_lvst_socket_url, {
            query: {
                'token': vy_lvst_muid,
                'user_id': vy_lvst_uid,
                'key': vy_lvst_code,
                'domain': window.location.hostname,
                'v': vy_lv_version
            },
            transports: ['websocket'],
            reconnection: false,
            reconnectionDelay: 2000,
            reconnectionAttempts: "Infinity",
            forceNew: true,
            upgrade: false,
            closeBeforeUnload: false
        });



    },

    _init: function() {
        const self = this;
        this.html = __j('html');
        this.st = $.extend({
            // These are the defaults.
            'soundVolume': 0.99,
            'target': '.btn-go-live',
            'button_title': vy_lvst_lang.go_live,
            'button_icon': vy_lvst_svgi.golive_ic,
            'body': document.body
        }, this.options);

        __j(document).on("mobileinit", function() {
            $.mobile.touchOverflowEnabled = true;
        });



        if (self.body.find('#vy_lv_container_box').length) {


            self.new_live();

        }
        this.getTurnCredentials();

        if (!this.isIosSafari())
            this.ligh_dark_mode();

        this.stopTouchMove();

    },
    iosNoBounce: function() {

        if (!__j(document).find('#ios_no_bounce').length && this.isIosSafari()) {
            __j(document).find('head').append(`<script id="ios_no_bounce" type="text/javascript" href="${vy_lvst_website_host}/${vy_lvst_assets}/lib/iNoBounce/inobounce.min.js"></script>`);
        }

    },
    isIosSafari: function() {

        const ua = window.navigator.userAgent;
        const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        const webkit = !!ua.match(/WebKit/i);
        const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

        return iOSSafari;

    },
    readCookie: function(name) {
        var nameEQ = name + "=";

        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
        }
        return null
    },
    createCookie: function(name, value, days) {
        if (!days) days = 100;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString()
        } else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/"
    },
    ligh_dark_mode: function() {
        // enable dark mode
        const self = this;
        const css_dark = __j('html');

        if (self.body.hasClass('night-mode')) {

            css_dark.addClass('vy_lv_dark');
            if (!css_dark.find('#sweetalert_dark').length)
                __j('#vy_lvst_script').prepend(`<link id="sweetalert_dark" rel="stylesheet" href="${vy_lvst_website_host}/${vy_lvst_assets}/lib/sweetalert/css/dark.css">`);
            else
                css_dark.find('#sweetalert_dark').removeAttr('disabled');

        } else if (!self.body.hasClass('night-mode')) {

            css_dark.removeClass('vy_lv_dark');
            css_dark.find('#sweetalert_dark').attr('disabled', 1);
        } else {
            css_dark.removeClass('vy_lv_dark');
            css_dark.find('#sweetalert_dark').attr('disabled', 1);
        }
        setTimeout(function() {
            self.ligh_dark_mode();
        }, 4000);


    },
    getTurnCredentials: function() {
        const self = this;
        return new Promise(async (resolve, reject) => {

            let send = await this.jajax(self.ajax_url, 'post', {
                'cmd': 'get-turn-credentials'
            }).done(function(json) {
                eval('vy_lvst.config=' + json)
                resolve(true);
            });

        });

    },
    generateInitButton: function(wondertag, click) {
        const self = this;
        const style_margin = wondertag ? 'style="margin-right:10px;"' : '';

        const wondertag_button = `<a id="vy_lv_startbutton" class="btn btn-mat tag_pub_box_bg_camlve" href="/livestream" title="${this.st.button_title}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17,10.5L21,6.5V17.5L17,13.5V17A1,1 0 0,1 16,18H4A1,1 0 0,1 3,17V7A1,1 0 0,1 4,6H16A1,1 0 0,1 17,7V10.5M14,16V15C14,13.67 11.33,13 10,13C8.67,13 6,13.67 6,15V16H14M10,8A2,2 0 0,0 8,10A2,2 0 0,0 10,12A2,2 0 0,0 12,10A2,2 0 0,0 10,8Z"></path></svg>
                                </a>`;
        const my_button = wondertag ? wondertag_button : `<div id="vy_lv_startbutton" ${style_margin} class="vy_lv_startbutton"><span class="vy_lv_defaultBtnIc">${this.st.button_icon}</span>&nbsp;${this.st.button_title}</div>`;


        __j(document).find('[data-vylvinitbutton]').replaceWith(my_button);

        __j(document).on('click', '#vy_lv_startbutton', function(e) {
            self.evstop(e, 1);
            self.body.removeClass('pub-focus');
            let default_button_href = "/livestream";

            const page = __j(document).find('[data-page]').data('page');
            const page_id = __j(document).find('[data-page]').data('id');

            switch (page) {


                case 'group':
                    default_button_href = `/livestream/g/${page_id}`;
                    break;

                case 'page':
                    default_button_href = `/livestream/p/${page_id}`;
                    break;

                case 'timeline':
                default:
                    break;



            }
            window.location = default_button_href;

        });

        if (click) {
            this._loading();
            __j(document).find('#vy_lv_startbutton').trigger('click');
        }
    },
    encodeHTML: function(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    },
    decodeHTML: function(s) {
        return $("<span />", {
            html: s
        }).text();
    },
    ws_close: function() {


        if (this.ws && this.ws.readyState === WebSocket.OPEN)
            this.ws.close();
    },
    _disconnect: function() {

        const self = this;

        this.ws_close();

        if (this.socket && this.socket.connected)
            this.socket.disconnect();

        if (self.timeouts.hasOwnProperty('disconnect_client_recon'))
            clearTimeout(self.timeouts['disconnect_client_recon']);
    },

    presenterResponse: function(message) {
        const self = this;
        if (message.response != 'accepted') {
            console.warn('Stream not accepted for the following reason: ' + (message.message ? message.message : 'Unknow error'));
            vy_lvst.dispose();
        } else {
            vy_lvst.webRtcPeer.processAnswer(message.sdpAnswer);
        }
    },
    viewerResponse: function(message) {
        const self = this;
        if (message.response != 'accepted') {
            console.warn('Stream not accepted for the following reason: ' + (message.message ? message.message : 'Unknow error'));
            vy_lvst.dispose();
        } else {
            vy_lvst.webRtcPeer.processAnswer(message.sdpAnswer);
        }
    },
    presenter: async function(reconn) {
        const self = this;
        if (!vy_lvst.webRtcPeer) {

            vy_lvst._loading();


            const options = await vy_lvst.presenter_get_conf();
            vy_lvst.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
                vy_lvst._rLoading();
                if (error) return vy_lvst.ws_onError(error);

                this.generateOffer(reconn ? vy_lvst.reconnect_onOfferPresenter : vy_lvst.onOfferPresenter);

                const pc = this.peerConnection;
                pc.addEventListener("iceconnectionstatechange", event => {

                    console.log(pc.iceConnectionState)
                    if (pc.iceConnectionState === "failed") {

                        pc.restartIce();
                    }
                });
            });
        }
    },

    presenter_get_conf: async function() {

        if (!vy_lvst.config || Object.keys(vy_lvst.config).length <= 0) {

            await vy_lvst.getTurnCredentials();

        }

        return {
            localVideo: vy_lvst.video[0],
            onicecandidate: vy_lvst.onIceCandidate,
            iceServers: vy_lvst.config,
            videoStream: vy_lvst.localStream
        };

    },
    ws_onError: function(err) {
        vy_lvst.showSwalErr('WSS: ' + err);
    },
    onOfferPresenter: function(error, offerSdp) {
        if (error) return vy_lvst.ws_onError(error);

        const message = {
            id: 'presenter',
            sdpOffer: offerSdp,
            reconnect: false
        };
        vy_lvst.ws_sendMessage(message);
    },
    reconnect_onOfferPresenter: function(error, offerSdp) {
        if (error) return vy_lvst.ws_onError(error);

        const message = {
            id: 'presenter',
            sdpOffer: offerSdp,
            reconnect: true
        };
        vy_lvst.ws_sendMessage(message);
    },
    ws_sendMessage: function(message) {
        const jsonMessage = JSON.stringify(message);
        vy_lvst.ws.send(jsonMessage);
    },

    viewer: function() {
        const self = this;
        if (!vy_lvst.webRtcPeer) {
            vy_lvst._loading();



            const options = {
                remoteVideo: vy_lvst.video[0],
                onicecandidate: vy_lvst.onIceCandidate,
                iceServers: vy_lvst.config
            }

            vy_lvst.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
                vy_lvst._rLoading();
                if (error) return vy_lvst.ws_onError(error);

                this.generateOffer(vy_lvst.onOfferViewer);
                const pc = this.peerConnection;
                pc.addEventListener("iceconnectionstatechange", event => {
                    if (pc.iceConnectionState === "failed") {

                        pc.restartIce();
                    }
                });
            });
        }
    },
    onOfferViewer: function(error, offerSdp) {
        if (error) return vy_lvst.ws_onError(error)

        const message = {
            id: 'viewer',
            sdpOffer: offerSdp
        }
        vy_lvst.ws_sendMessage(message);
    },
    onIceCandidate: function(candidate) {
        vy_lvst.ws_sendMessage({
            id: 'onIceCandidate',
            candidate: candidate
        });
    },
    k_stop: function() {
        if (vy_lvst.webRtcPeer) {
            vy_lvst.ws_sendMessage({
                id: 'stop'
            });
            vy_lvst.dispose();
        }
    },

    dispose: function() {
        if (vy_lvst.webRtcPeer) {
            vy_lvst.webRtcPeer.dispose();
            vy_lvst.webRtcPeer = null;
        }
        vy_lvst._rLoading();
    },
    _wss_connect: async function(post_id, callback, r_user_id) {
        const self = this;

        if (vy_lvst.ws && vy_lvst.ws.readyState === WebSocket.OPEN) {
            if (callback) callback();
            return vy_lvst.ws;
        }

        r_user_id = r_user_id || vy_lvst_uid;


        vy_lvst.ws = new WebSocket(`wss://${vy_lvst_socket_url}/vybroadcasting?p=${post_id}&u=${vy_lvst_uid}`);

        /* WS events */
        vy_lvst.ws.onmessage = function(message) {
            let parsedMessage = JSON.parse(message.data);

            switch (parsedMessage.id) {
                case 'presenterResponse':

                    vy_lvst.presenterResponse(parsedMessage);
                    break;
                case 'viewerResponse':

                    vy_lvst.viewerResponse(parsedMessage);
                    break;
                case 'stopCommunication':

                    vy_lvst.dispose();
                    break;
                case 'iceCandidate':

                    vy_lvst.webRtcPeer.addIceCandidate(parsedMessage.candidate)
                    break;
                default:

                    console.error('Unrecognized message', parsedMessage);
            }
        }
        vy_lvst.ws.addEventListener('open', function(event) {

            console.log("%ckontackt conn.s..!", "color: green; font-size:10px;");
            vy_lvst.ws_sendMessage({
                id: 'ices',
                ices: JSON.stringify(vy_lvst.config.iceServers)
            });

            if (callback) callback();
            vy_lvst.config = {};
        });

    },
    _connect: function() {

        const self = this;

        if (this.socket != null && this.socket.connected)
            return this.socket;




        this.socket = self.connect_to_server();




        /* Socket.io events */

        this.socket.on('error', function(err) {

            console.error("%cLive Plugin is offline", "color: red; font-size:25px;");
            console.error("%c" + err, "color: red; font-size:18px;");

        });

        this.socket.on('disconnect', function(err) {


            let reconnecting_att = function() {

                self.timeouts['disconnect_client_recon'] = setTimeout(function() {

                    //if(!self.socket.connected && (window.location.pathname == '/livestream' || window.location.pathname == '/watchstream')) {
                    if (window.location.pathname == '/livestream' || window.location.pathname == '/watchstream') {
                        //self.socket.socket.connect();
                        self._connect();
                        if (self.socket != null && self.socket.connected) {
                            if (self.is_live && self.im_host) {

                                self.hostReconnectedSuccess();
                                self.broadcastData(self.live_id, true);
                            } else {
                                self.socket.emit('join_to_live', JSON.stringify({
                                    'live_id': escape(self.live_id),
                                    'user_id': escape(vy_lvst_user.i),
                                    'user': vy_lvst_user
                                }));
                            }

                        } else {

                            reconnecting_att();
                        }
                    }

                }, 30000);

            }

            let reconnecting_dis = function(){
                if (window.location.pathname == '/livestream' || window.location.pathname == '/watchstream') {
                    self._connect();
                        if (self.socket != null && self.socket.connected) {
                            if (self.is_live && self.im_host) {
                                self.hostReconnectedSuccess();
                                self.broadcastData(self.live_id, true);
                            } else if(self.live_id > 0){
                                self.socket.emit('join_to_live', JSON.stringify({
                                    'live_id': escape(self.live_id),
                                    'user_id': escape(vy_lvst_user.i),
                                    'user': vy_lvst_user
                                }));
                              
                            }

                        } else {

                            setTimeout(function(){reconnecting_dis();},2000);
                        }                }

            }
            self.ws_close();
            if(vy_lvst_reconnecting) reconnecting_att(); else reconnecting_dis();

            
            if(vy_lvst_reconnecting) {
                if (err == 'client namespace disconnect')
                    clearTimeout(self.timeouts['disconnect_client_recon']);

                if ((err == 'ping timeout' || err == 'transport close') && self.im_host && self.is_live) {
                    self.timeouts['host_reconnecting_msg_timer'] = setTimeout(function() {
                        self.showReconnectingToHost(err);
                    }, 50);

                    setTimeout(() => {
                        self._connect();
                        self.socket.emit('host_restore', self.live_id, err);

                    }, 1500);

                }
            }

        });
        this.socket.on('connect_error', function(err) {
            //if(!vy_lvst_reconnecting)
            //self.showSwalErr(vy_lvst_lang.err_connect_server + '[0]: ' + err);

        });
        this.socket.on('error', function(err) {
            if(!vy_lvst_reconnecting)
            self.showSwalErr(vy_lvst_lang.err_connect_server + ': ' + err);

        });
        this.socket.on('connect', function() {
 
            self.socket.emit('connect_user', vy_lvst_uid, vy_lvst_muid);

        });



        this.socket.on('host_away', function(id) {

            const live_content = __j('.js__vylivest_' + id);

            if (live_content.length) {

                live_content.addClass('__away');

                live_content.find('video#vy_lv_livestream')[0].muted = true;
            }

        });
        this.socket.on('host_remove_away', function(id) {

            const live_content = __j('.js__vylivest_' + id);

            if (live_content.length) {

                live_content.removeClass('__away');
                live_content.find('video#vy_lv_livestream')[0].muted = false;
            }

        });

        this.socket.on('added-moderator', function(live_id, user_id) {

            if (user_id != vy_lvst_uid) return;

            self.playSound('openpopup');
            Swal.fire(
                vy_lvst_lang.congrats + '!',
                vy_lvst_lang.notif_you_added_as_moder + '.',
                'success'
            );

            self.im_moderator = 1;
        });
        this.socket.on('removed-moderator', function(live_id, user_id) {
            if (user_id != vy_lvst_uid) return;
            self.playSound('openpopup');
            Swal.fire(
                vy_lvst_lang.warning + '!',
                vy_lvst_lang.notif_removed_from_moderators + '.',
                'warning'
            );
            self.im_moderator = 0;
        });


        this.socket.on('notification', function(data) {

            const d = self.validateJson(data);

            if (!d.hasOwnProperty('by'))
                d['by'] = '';
            else
                d['by'] = '<span class="vy_lv_smalltxt">(' + decodeURIComponent(d.by) + ')</span>';



            let s = {};

            s['cmd'] = 'get-userdetails';
            s['id'] = escape(d.user_id);

            let send = self.jajax(self.ajax_url, 'post', s);
            send.done(function(user) {


                const comments_section = self.cnt.find('#vy_lv_comments_section');
                user = self.validateJson(user);
                switch (d.notification) {

                    case 'muted':
                        comments_section.append(self.r(self.notif_markup, {
                            '%user_id': d.user_id,
                            '%by': d.by,
                            '%class': 'vy_lv_notif__muted',
                            '%ic': vy_lvst_svgi.mute,
                            '%text': vy_lvst_lang.notif_has_been_muted,
                            '%avatar': user.avatar,
                            '%user_name': user.fullname
                        }));
                        break;
                    case 'unmuted':
                        comments_section.append(self.r(self.notif_markup, {
                            '%user_id': d.user_id,
                            '%by': d.by,
                            '%class': 'vy_lv_notif__unmuted',
                            '%ic': vy_lvst_svgi.unmute,
                            '%text': vy_lvst_lang.notif_has_been_unmuted,
                            '%avatar': user.avatar,
                            '%user_name': user.fullname
                        }));
                        break;
                    case 'blocked':
                        comments_section.append(self.r(self.notif_markup, {
                            '%user_id': d.user_id,
                            '%by': d.by,
                            '%class': 'vy_lv_notif__blocked',
                            '%ic': vy_lvst_svgi.block,
                            '%text': vy_lvst_lang.notif_has_been_blocked,
                            '%avatar': user.avatar,
                            '%user_name': user.fullname
                        }));
                        break;
                    case 'unblocked':
                        comments_section.append(self.r(self.notif_markup, {
                            '%user_id': d.user_id,
                            '%by': d.by,
                            '%class': 'vy_lv_notif__unblocked',
                            '%ic': vy_lvst_svgi.unblock,
                            '%text': vy_lvst_lang.notif_has_been_unblocked,
                            '%avatar': user.avatar,
                            '%user_name': user.fullname
                        }));
                        break;
                    case 'moderator-added':
                        comments_section.append(self.r(self.notif_markup, {
                            '%user_id': d.user_id,
                            '%by': d.by,
                            '%class': 'vy_lv_notif__moderator_added',
                            '%ic': vy_lvst_svgi.moderator,
                            '%text': vy_lvst_lang.notif_now_is_moderator,
                            '%avatar': user.avatar,
                            '%user_name': user.fullname
                        }));
                        break;
                    case 'moderator-removed':
                        comments_section.append(self.r(self.notif_markup, {
                            '%user_id': d.user_id,
                            '%by': d.by,
                            '%class': 'vy_lv_notif__moderator_removed',
                            '%ic': vy_lvst_svgi.user,
                            '%text': vy_lvst_lang.notif_is_not_longer_moderator,
                            '%avatar': user.avatar,
                            '%user_name': user.fullname
                        }));
                        break;

                }

                self.scrollComments(comments_section, 1);

            });




        });
        this.socket.on('count_viewers', function(data) {
            data = self.validateJson(data);

            const comments_section = __j('#vy_lv_comments_section');
            __j('.js__vylv_count2_viewers,.js__vylv4_count_viewers').text(data.count);

            if (data.enter == 'yes') {
                comments_section.append(self.r(self.notif_markup, {
                    '%user_id': data.user.i,
                    '%by': '',
                    '%class': '',
                    '%ic': vy_lvst_svgi.plus,
                    '%text': vy_lvst_lang.notif_joined_to_live,
                    '%avatar': data.user.p,
                    '%user_name': data.user.fn
                }));
                self.scrollComments(comments_section, 1);
            }

        });
        this.socket.on('blocked', function(live_id, user_id) {
            if (user_id != vy_lvst_uid) return;
            self.exitFromStream(live_id);
            self.playSound('openpopup');
            Swal.fire(
                vy_lvst_lang.notif_blocked,
                vy_lvst_lang.notif_blocked_descr,
                'warning'
            );
        });
        this.socket.on('muted', function(live_id, user_id) {

            if (user_id != vy_lvst_uid) return;

            self.playSound('openpopup');
            Swal.fire(vy_lvst_lang.muted,
                vy_lvst_lang.notif_muted_by_host,
                'warning'
            );

            self.hidePostCommentBox(live_id);
            self.im_muted = 1;
        });
        this.socket.on('unmuted', function(live_id, user_id) {

            if (user_id != vy_lvst_uid) return;

            self.playSound('openpopup');
            Swal.fire(vy_lvst_lang.unmuted,
                vy_lvst_lang.notif_unmuted_by_host + '.',
                'success'
            );
            self.im_muted = 0;
            self.showPostCommentBox(live_id);

        });
        this.socket.on('broadcast_end', function(id, reason) {
            self.playSound('openpopup');

            let default_reason = vy_lvst_lang.broadcast_has_been_stoped_by_host + '.',
                msg = default_reason,
                ic = 'info',
                title = vy_lvst_lang.live_ended + '!';
            switch (reason) {

                case 'forcefully_disconnected':
                    msg = default_reason;
                    break;
                case 'manually_disconnected':
                    msg = default_reason;
                    break;
                case 'server_down':
                    msg = vy_lvst_lang.msg_server_down;
                    ic = 'error';
                    title = vy_lvst_lang.error;
                    break;
                case 'socket_error':
                    msg = vy_lvst_lang.msg_socket_error;
                    ic = 'error';
                    title = vy_lvst_lang.error;
                    break;
                default:
                    msg = default_reason;

            }

            Swal.fire(title, msg, ic);
            self.exitFromStream(id);

        });

        this.socket.on('wait_broadcast', self.wait_broadcast);

        this.socket.on('host_network_restored', function(id, _time) {
            self.host_restored();
            self.ws_close();
            self.joinToLive(self.live_id, true);
            if(!vy_lvst_reconnecting) return;
            self.destroy_timer();
            self.start_timer(_time);
            clearTimeout(self.timeouts['check_host_restore']);

        });

        this.socket.on('reaction_floating', function(data) {

            let settings = {
                appendTo: 'vy_lv_reactions_floating', // id
                pointerX: Math.floor(Math.random() * 15) + 1,
                pointerY: Math.floor(Math.random() * 15) + 1,
                // the character or string to float
                content: data.icon,

                // the number of items
                number: 1,

                // the amount of seconds it takes to float up
                duration: 5,

                // the number of times you want the animation to repeat
                repeat: 1

            };

            if (data.sender == vy_lvst_user.i) {
                settings['appendTo'] = 'vy-livest';
                settings['pointerX'] = data.pointerX;
                settings['pointerY'] = data.pointerY;

            }


            floating(settings);

        });
        this.socket.on('new_comment', function(data) {
            const comments = __j('#vy_lv_comments_section');
            let _scroll = 0;


            let atBottom = function(ele) {
                ele = ele[0];
                const sh = ele.scrollHeight;
                const st = ele.scrollTop;
                const ht = ele.offsetHeight;
                if (ht == 0) {
                    return true;
                }
                if (st + 50 >= sh - ht) {
                    return true;
                } else {
                    return false;
                }
            }

            if (data.user_id != vy_lvst_user.i) {


                if (atBottom(comments))
                    _scroll = 1;

                let comment_markup = self.author == vy_lvst_user.i ? self.comment_markup_author : self.comment_markup;

                if (self.im_moderator)
                    comment_markup = self.comment_markup_moderator;

                comments.append(self.r(comment_markup, {
                    '%moderator': self.isModerator(data.live_id, data.is_moderator),
                    '%user_id': data.user_id,
                    '%avatar': data.user_avatar,
                    '%user_name': data.user_name,
                    '%comment': data.comment
                }));

                if (_scroll)
                    self.scrollComments(comments, 1);
            }
        });

        this.socket.on('obs_invalid_key', function() {


            self.showSwalErr(vy_lvst_lang.obs_invalid_stream_key);
        });
        this.socket.on('obs_stopped', async function(path) {
            self.destroy_flvplayer();
            self.stopStream();
            __j('.vy_lv_a17cam,#vy_lv_a17cam_wait_stream').fadeIn();

            self.disable_btn();

            // if obs has been stoped, and the live hasn't started, delete the record
            if (!self.is_live) {
                self.obs_stream = 0;
                self.socket.emit('delete_obs_record', self.obs_stream_p, vy_lvst_uid);
            } else {

                //  self.filename = self.generateFilename();
                self.file_type = "mp4";


                if (self.current_min < 1 && self.post_to_timeline == 'yes' && vy_lv_recording) {

                    return self.removeShortVideos();

                }
                self.obs_stream = 0;
                if (self.post_to_timeline == 'no') {
                    self.socket.emit('delete_obs_record', self.obs_stream_p, vy_lvst_uid);
                } else {
                    await self.renameObsFile(self.filename, path);
                }

                self.stopLive();

            }
        });
        this.socket.on('obs_started', function(stream_path) {

            self.construct_FLVPlayer(stream_path);
            self.enable_btn();
            self.obs_stream = 1;
            self.obs_stream_p = stream_path;
            __j('.vy_lv_a17cam,#vy_lv_a17cam_wait_stream').hide();
            self.start_obs++;
        });

        return self.socket;
    },
    isModerator: function(id, is_moderator) {

        return is_moderator ? '<span class="vy_lv_moder_st">' + vy_lvst_lang.moderator + '</span>' : '';
    },
    checkManuallyIfHostIsBack: function(id) {
        const self = this;
        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/ping-host',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": escape(id)
            }),
            type: 'POST',
            success: function(d) {

                d = self.validateJson(d);
                if (d.exists > 0) {
                    clearTimeout(self.timeouts['check_host_restore']);
                    host_restored();
                } else {
                    self.timeouts['check_host_restore'] = setTimeout(function() {
                        self.checkManuallyIfHostIsBack(id);
                    }, 1500);
                }
            },
            error: function(xhr, status, error) {
                console.log('Error: ' + error.message);
                self.timeouts['check_host_restore'] = setTimeout(function() {
                    self.checkManuallyIfHostIsBack(id);
                }, 1500);
            },
        });
    },

    showReconnectingToHost: function(err) {

        const self = this;
        const _rtmpv = __j('#vy_lv_rtmpv');




        if (!_rtmpv.find('#vy_lv_hostr321').length) {

            _rtmpv.append(self.host_reconnecting_warn);
            _rtmpv.addClass('host_reconnecting');
            self.pause_timer();

            this.easy_timer2 = new easytimer.Timer({
                precision: 'seconds'
            });
            this.host_reconnected_stop_timer = false;
            this.easy_timer2.addEventListener('secondsUpdated', function(e) {
                _rtmpv.find('#host_reconnecting_timer').html(self.easy_timer2.getTimeValues().toString(['minutes', 'seconds']));
            });
            vy_lvst.video.trigger('pause');
            this.easy_timer2.start({
                countdown: true,
                startValues: {
                    seconds: 120
                }
            });
            this.easy_timer2.addEventListener('targetAchieved', function(e) {

                if (!self.host_reconnected_stop_timer)
                    self.stopLive();
            });


        }

    },
    hostReconnectedSuccess: function() {
        const self = this;
        const _rtmpv = __j('#vy_lv_rtmpv');

        if (this.easy_timer2) {
            this.easy_timer2.stop();
            this.easy_timer2.reset();
            this.host_reconnected_stop_timer = true;
            this.easy_timer2.removeEventListener('targetAchieved');
            this.rm_broadcast_reconnecting_queue(self.live_id);
        }
        if (self.timer_stopped)
            self.reload_timer();


        vy_lvst.video.trigger('play');
        if ('disconnect_client_recon' in self.timeouts)
            clearTimeout(self.timeouts['disconnect_client_recon']);

        if ('host_reconnecting_msg_timer' in self.timeouts)
            clearTimeout(self.timeouts['host_reconnecting_msg_timer']);

        if (!_rtmpv.find('#vy_lv_hr_success').length) {

            _rtmpv.find('#vy_lv_hostr321').remove();

            _rtmpv.prepend(self.host_reconnected_success);
            _rtmpv.find('#vy_lv_hr_success').addClass('show');
            setTimeout(function() {
                self.socket.emit('host_reconnected_successfully', self.live_id);
                _rtmpv.find('#vy_lv_hr_success').addClass('hide').on(self.crossEvent(), function() {
                    __j(this).removeClass('show').remove();
                });

            }, 500);
        }
    },
    host_restored: function() {
        
        vy_lvst._rthreedotsloading();
        __j('body').find('#vy-livest').removeClass('__reconnecting');

    },
    wait_broadcast: function(id, reason, only_load) {
        const self = this;
        const e = __j('body').find('#vy-livest');

        if(!vy_lvst_reconnecting) return;

        vy_lvst._threedotsloading();
        vy_lvst.pause_timer();
        vy_lvst.checkManuallyIfHostIsBack(id);
 
        switch (reason) {

            case 'ping_timeout':
                if (!only_load)
                    e.addClass('__reconnecting');
                break;

            case 'network_error':
                if (!only_load)
                    e.addClass('__reconnecting');
                break;

        };

    },
    crossEvent: function() {

        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }
        for (var t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }

    },
    liveHeartBeat: function(id) {
        const self = this;
        if (__j('#three-dots-loading').length) {

            self.timeouts['still_three_dots_loading'] = setTimeout(function() {
                self.checkManuallyIfHostIsBack(id);
            }, 2000);

        } else {
            if ('still_three_dots_loading' in self.timeouts)
                clearTimeout(self.timeouts['still_three_dots_loading']);
        }

    },
    stopTracks: function() {
        if (this.localStream)
            this.localStream.getTracks().forEach(track => track.stop()); // stop each of them

    },
    removeLiveFrontEnd: function() {

        __j('#vy_lv_container_box').fadeOut(function() {
            __j(this).remove()
        });

    },
    confirmDeletingShortStreams: function() {
        const self = this;

        Swal.fire({
            title: vy_lvst_lang.Unsavable + '!',
            text: vy_lvst_lang.your_stream_is_too_short,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.delete_it,
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self.removeShortVideos();
            }
        });



    },
    commentClick: function(el, ev, user_id) {

        const self = this;

        self.evstop(ev, 1);

        if (user_id == vy_lvst_uid) return;

        if (self.im_host) {
            return vy_lvst.mViewer(el, ev, user_id);
        } else if (self.im_moderator) {
            return vy_lvst.mViewer(el, ev, user_id);
        } else {
            return vy_lvst.replyToComment(el, ev, user_id);
        }


    },
    mViewer: async function(el, e, user_id) {
        const self = this;

        self.evstop(e, 1);

        if (user_id == vy_lvst_uid) {

            self.playSound('openpopup');
            return Swal.fire(
                vy_lvst_lang.error,
                vy_lvst_lang.you_cant_moderate_yourself + '!',
                'error'
            );
        }

        el = __j(el);
        const live_id = self.live_id;
        const check_moder = await self.checkIfImModer();
        const live_data_o = await self.getLiveData(live_id, user_id);

        if ((!check_moder.moderator || check_moder.moderator == false) && check_moder.is_host == false) {
            self.playSound('openpopup');
            return Swal.fire(
                vy_lvst_lang.error,
                vy_lvst_lang.you_are_not_moderator + '!',
                'error'
            );


        }




        let _html = '<div>%b1 %b2 %b3 %b4</div>',
            btns = {
                'reply': `<button class="swal2-default swal2-styled" onclick="vy_lvst.replyToComment(this,event,${user_id});">${vy_lvst_lang.reply}</button>`,
                'block': `<button class="swal2-deny swal2-styled" onclick="vy_lvst.blockViewer(event,this,${user_id},${live_id});">${vy_lvst_lang.block}</button>`,
                'mute': `<button class="swal2-confirm swal2-styled" onclick="vy_lvst.muteViewer(event,this,${user_id},${live_id});">${vy_lvst_lang.mute}</button>`,
                'cancel': `<button class="swal2-cancel swal2-styled" onclick="vy_lvst.removeSwal2(event,this);">${vy_lvst_lang.cancel}</button>`

            };

        if (self.im_host && self._is_smartphone())
            btns['reply'] = '';

        //if(self.blocked_users.hasOwnProperty(live_id)){

        ///if(self.findinObj(self.blocked_users[live_id],user_id))
        if (live_data_o.blocked == 'yes')
            btns['block'] = `<button class="swal2-green swal2-styled" onclick="vy_lvst.unBlockViewer(event,this,${user_id},${live_id});">${vy_lvst_lang.unblock}</button>`;

        //}

        //if(self.muted_users.hasOwnProperty(live_id)){
        //if(self.findinObj(self.muted_users[live_id],user_id)) 
        if (live_data_o.muted == 'yes')
            btns['mute'] = `<button class="swal2-green swal2-styled" onclick="vy_lvst.unMuteViewer(event,this,${user_id},${live_id});">${vy_lvst_lang.unmute}</button>`;


        //}

        _html = _html.replace('%b1', btns.block).replace('%b2', btns.mute).replace('%b3', btns.reply).replace('%b4', btns.cancel);


        Swal.fire({
            title: vy_lvst_lang.what_you_want_with_this_viewer,
            icon: "warning",
            width: 420,
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: true,
            html: _html
        });

        this.jajax(this.ajax_url, 'post', {
            'cmd': 'get-userdetails',
            'id': escape(user_id)
        }).done(function(data) {
            data = self.validateJson(data);

            if (!data.follwing_btn)
                data.follwing_btn = '';

            const fme = data.following_me ? vy_lvst_lang.following_you : vy_lvst_lang.not_following_you;
            Swal.update({

                footer: '<div class="vy_lv_user_ban_footer">\
                    <div class="vy_lv_user_ban_footer_av"><img src="' + data.avatar + '" /></div>\
                    <div class="vy_lv_user_ban_footer_subsc"><span class="vy_lv_user_ban_footer_subsc_t">' + data.fullname + '&nbsp;' + fme + '</span>&nbsp;&nbsp;&nbsp;' + data.follwing_btn + '</div>\
                    </div>'

            })

        });



    },
    findinObj: function(obj, k) {
        const f = Object.keys(obj).filter(function(key) {
            return obj[key] === k;
        });

        return f.length;
    },
    removeSwal2: function(e, el) {
        this.evstop(e);
        Swal.close();

    },
    removeShortVideos: function() {
        const self = this;
        self.live_stopped = 1;



        // delete OBS 
        if (self.obs_stream) {

            self.stopObsfirst(1);

        }

        self.socket_end_broadcast();

        self.unbindEvents();
        self.removePopups();
        self.socket.close();
        self._disconnect();

        if (!self.obs_stream)
            self.stopTracks();

        self.removeLiveFrontEnd();
        self.stopMediaRecorder();
        vy_lvst.k_stop();

        Swal.fire({
            title: vy_lvst_lang.removed + '!',
            text: vy_lvst_lang.broadcast_removed + "!",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.take_me_to_the_feed,
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self.gotohome(10, 1);

            }



        });
        self._disconnect();
        let send_data = {
            'cmd': 'delete-broadcast',
            'id': self.live_id,
            'broadcast_id': self.broadcast_id,
            'filename': self.filename,
            'file_type': self.file_type
        };
        if ('sendBeacon' in navigator) {
            navigator.sendBeacon(this.ajax_url, self.toFormData(send_data));

        } else {
            // send request to remove it completely from db
            this.jajax(this.ajax_url, 'post', send_data);

        }
        self.clearVars();
        setTimeout(function() {

            self.gotohome(10, 1);

        }, 2000);
    },
    removePopups: function() {

        // remove popups 
        __j('.js_vy_lv_global_pp').remove();

    },
    socket_end_broadcast: function() {
        const self = this;
        this.socket.emit('end_broadcast', self.live_id);
    },
    clearVars: function() {
        const self = this;

        self.last_live_id = self.live_id;
        self.live_id = 0;
        self.broadcast_id = 0;
        self.is_live = 0;
        self.im_moderator = 0;

    },
    renameObsFile: function(filename, path) {


        this.jajax(this.ajax_url, 'post', {
            'cmd': 'rename-obs-file',
            'filename': filename,
            'path': path
        });
    },
    getPreLiveSettings: async function() {
        const self = this;
        return new Promise(async (resolve, reject) => {

            let getPreLiveCMD = {
                'cmd': 'get-prelive-st'
            };

            if (self.page_id > 0)
                getPreLiveCMD['page_id'] = self.page_id;

            if (self.group_id > 0)
                getPreLiveCMD['group_id'] = self.group_id;

            await this.jajax(this.ajax_url, 'post', getPreLiveCMD).done(function(h) {

                __j('#vy_lv_prelive_st').replaceWith(h);

                $('#js__vy_lv_brd_related_to').ddslick({
                    'width': '100%'
                });

            });
            resolve(true);
        });
    },
    updateGoLiveData: function(_this, key) {
        const self = this;
        setTimeout(function() {
            if (key == 'record') {
                if (_this.checked)
                    _this.value = "yes";
                else
                    _this.value = "no";

            }


            self.golive_data[key] = _this.value;

        }, 200);

    },
    resetGoLiveData: function(evt, _this, key) {

        this.golive_data = {
            'audience': 1,
            'description': '',
            'title': '',
            'record': vy_lv_recording
        };

    },
    rm_broadcast_reconnecting_queue:function(live_id){
        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/rm_broadcast_reconnecting_queue',
            contentType: 'application/json',
            data: JSON.stringify({
                'id': live_id
            }),
            type: 'POST',
            success: function(data) {
            },
            error: function(xhr, status, error) {

            }
        });

    },
    check_server_health: function() {
        const self = this;
        self._loading();
        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/check_health',
            contentType: 'application/json',
            data: JSON.stringify({
                'user_id': vy_lvst_uid
            }),
            type: 'POST',
            success: function(data) {

                self._rLoading();

                self._connect();
            },
            error: function(xhr, status, error) {
                self._rLoading();

                setTimeout(function() {
                    self.playSound('openpopup');
                }, 50);

                Swal.fire({
                    showCloseButton: false,
                    showCancelButton: false,
                    showDenyButton: false,
                    confirmButtonText: vy_lvst_lang.try_again,
                    icon: 'error',
                    title: 'Oops...',
                    text: vy_lvst_lang.server_down,
                    footer: '<span style="color:red;font-size:14.5px;">' + vy_lvst_lang.server_not_responding + '</span>&nbsp;<a href="javascript:window.location.reload();">' + vy_lvst_lang.try_again + '</a>'
                }).then((result) => {
                    window.location.reload();
                })

            }
        });

    },
    generateStreamKey: function() {

        const self = this;
        if (self.obs_stream_key_session_generated) return;
        self._loading();

        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/generateOBSstreamKey',
            contentType: 'application/json',
            data: JSON.stringify({
                'user_id': vy_lvst_uid
            }),
            type: 'POST',
            success: function(data) {

                self._rLoading();
                if (data.error) {

                    self.showSwalErr(vy_lvst_lang.error + ': ' + data.error);
                } else {
                    self.obs_stream_name = data.key;
                    self.obs_stream_key_session_generated = 1;
                    __j('.js__loading_Key').removeClass('__loadingkey').val(data.key);
                }
            },
            error: function(xhr, status, error) {
                self._rLoading();
                console.log('Error: ' + error.message);

                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);

            },
        });


    },
    scrollComments: function(comments, animation) {

        if (!animation)
            comments.scrollTop(comments[0].scrollHeight);
        else {

            setTimeout(function() {
                comments.animate({
                    'scrollTop': comments[0].scrollHeight
                });
            }, 250);
        }

    },
    new_live: async function() {

        const self = this;
        await this.responsive();

        self._btns();
        self.createSounds();

        if (await self.requestCam()) {

            self.enable_btn();

        } else {

            self.disable_btn();

        }




    },
    disable_btn: function() {
        this.can_stream_now = false;
        this.btn_go.attr({
            'disabled': 1,
            'readonly': 1
        }).addClass('__disabled');

    },
    enable_btn: function() {
        this.can_stream_now = true;
        this.btn_go.removeAttr('disabled').removeAttr('readonly').removeClass('__disabled');
    },
    remove_popups: function() {

        this.body.find('.js_vy_lv_global_pp').slideUp(170, function() {
            __j(this).remove();
        });

    },

    _popup: async function(categ, params, confirmation, callback) {
        const self = this;
        let cnt = null;
        self._loading();
        self.remove_popups();

        const data = {};

        data['cmd'] = 'popup';
        data['categ'] = categ;

        if (Object.keys(params).length)
            for (var x in params)
                data[x] = params[x];


        let send = await this.jajax(this.ajax_url, 'post', data).done(function(data) {

            self._rLoading();

            self.body.prepend(data);

            const $cnt = self.body.find('.js_vy_lv_global_pp_cnt');
            const $close = $cnt.parent().find('.js__vy_lv__globalpopup_close,#vy_lv_pp_cancel_btn');
            const $ok = $cnt.parent().find('#vy_lv_pp_ok_btn');
            cnt = $cnt;
            $close.on('click', function() {
                self.remove_popups();
            });
            $ok.on('click', function(e) {
                if (typeof confirmation == 'function')
                    confirmation(e);
            });

            if (typeof callback == 'function')
                callback($cnt);

        });

        return cnt;

    },
    _threedotsloading: function(whichone) {

        const self = this;
        const loading_classes = {

            "elastic": "dot-elastic",
            "pulse": "dot-pulse",
            "flashing": "dot-flashing",
            "collision": "dot-collision",
            "revolution": "dot-revolution",
            "carousel": "dot-carousel",
            "typing": "dot-typing",
            "windmill": "dot-windmill",
            "bricks": "dot-bricks",
            "floating": "dot-floating",
            "fire": "dot-fire",
            "spin": "dot-spin",
            "falling": "dot-falling",
            "stretching": "dot-stretching"


        };
        const df = loading_classes.bricks;
        whichone = whichone || df;

        if (!this.body.find(self.three_dots_loading).length) {

            this.body.append('<div id="' + self.three_dots_loading.replace('#', '') + '"><div class="' + whichone + '"></div></div>');

        }

    },
    _rthreedotsloading: function() {
        const self = this;
        __j('body').find(self.three_dots_loading).remove();
    },
    _loading: function(custom_text) {

        if (this.loverlay)
            return;


        this.spinner_opts = {
            lines: 13, // The number of lines to draw
            length: 11, // The length of each line
            width: 5, // The line thickness
            radius: 17, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#FFF', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        this.spinner_target = document.createElement("div");
        document.body.appendChild(this.spinner_target);
        this.spinner = new Spinner(this.spinner_opts).spin(this.spinner_target);
        this.loverlay = iosOverlay({
            text: custom_text ? custom_text : vy_lvst_lang.loading,
            duration: 99999999999,
            spinner: this.spinner
        });

    },
    _rLoading: function() {

        if (this.loverlay != null) {
            this.loverlay.hide();
            this.loverlay = null;
        }

    },
    _is_smartphone: function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || navigator.vendor || window.opera))
            return true;

        return false;

    },
    responsive: async function() {



        this.page_id = __j('#vy_lv_page_id').val();
        this.group_id = __j('#vy_lv_group_id').val();

        if (!this._is_smartphone()) {
            this.html.addClass('_hoverlv');
            await this.loadContent('desktop');

        } else {
            //this.responsiveForMobiles();
            await this.loadContent('mobile');

        }

        this.cnt = __j('#vy_lv_container_box');
        this.check_server_health();

        __j('body').find('[data-ajax]').each(function() {

            __j(this).removeAttr('data-ajax');

        });

        /* __j(window).off('beforeunload.vy_lv_confirm_exit').on('beforeunload.vy_lv_confirm_exit', (event) => {
              // Cancel the event as stated by the standard.
              event.preventDefault();
              // Chrome requires returnValue to be set.
              event.returnValue = '';
              self.didEnterBeforeUnload = true;
              return vy_lvst_lang.confirm_leave_page+".";
            });*/

    },
    _rrEmojis: function() {



        __j('#vy_lv_txtemojis').emoji({
            place: 'after'
        });
    },
    video_height: function(dif) {

        return __j(window).height() - dif;
    },
    _rrVideo: function(dif) {
        const self = this;
        const _rtmpv = __j('#vy_lv_rtmpv');
        
        _rtmpv.css({
            'height': self.video_height(dif)
        });
    },
    loadContent: async function(type) {


        const self = this;
        return new Promise(async (resolve, reject) => {

            this.page_id = __j('#vy_lv_page_id').val();
            this.group_id = __j('#vy_lv_group_id').val();


            let getCntCMD = {
                'cmd': 'get-content',
                'type': type
            };

            if (self.page_id > 0)
                getCntCMD['page_id'] = self.page_id;

            if (self.group_id > 0)
                getCntCMD['group_id'] = self.group_id;

            await this.jajax(this.ajax_url, 'post', getCntCMD).done(function(h) {




                __j('#vy_lv_container_box').html(h);

                self.video = __j('#vy_lv_rtmpv video');




                if (type == 'desktop') {
                    setTimeout(async function() {

                        await self.getPreLiveSettings();
                        self.enumerateMediaDevices();
                        self._rrEmojis();

                        if(!self.html.hasClass('s_hideheader'))
                            self._rrVideo(70);
                        else
                            self._rrVideo(10);

                        setTimeout(self.removeIntro(), 500);
                        resolve(true);
                    }, 500);

                } else if (type == 'mobile') {
                    self._rrEmojis();
                    self._rrVideo(40);
                    self._responsiveMobiles();
                    self.mob_addEventlisteners();

                    setTimeout(self.removeIntro(), 500);
                    resolve(true);

                } else {


                    self.showSwalErr(vy_lvst_lang.err_invalid_parameters_in_req);
                    resolve(true);
                }




            });
        });
    },
    makeFullScreen: function(e, el) {

        if (!this.isFullScreen()) {
            this.html.removeClass('vy_lv-fullscreen');
            if (el)
                el.fadeIn();
        } else
            this.html.addClass('vy_lv-fullscreen');
    },
    showTapForFullScreen: function() {

        const self = this,
            b = __j('body');

        if (!b.find('#vy_lv_fullscreen_sensor').length && !self.isFullScreen()) {
            b.prepend('<section ontouchend="return vy_lvst.removeTapForFullScreen(event,this);" id="vy_lv_fullscreen_sensor" class="__tap_fullscreen_sensor">' + vy_lvst_svgi.single_finger_tap + '</section>');

        }


    },
    removeTapForFullScreen: function(e, el) {

        const self = this;

        el = __j(el);

        el.hide();
        self.toFullscreen();

        __j(document).off('fullscreenchange.b11').on('fullscreenchange.b11', function(e) {

            self.makeFullScreen(e, el);




        });



    },
    _responsiveMobiles: function() {


        const self = this;

        this.__onmobiles();
        this.showTapForFullScreen();

        this.html.addClass('vy-lv-window');
        if (!this.head.find('#vy_lv_FROM').length)
            this.head.find('[name="viewport"]').replaceWith('<meta id="vy_lv_FROM" name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">')


        __j(window).on('resize.vy_lvst', function() {
            self.responsiveinLiveMob();

        });




    },
    sngineHeaderHideEffect:function(){
    __j('.vy_lv_a1').addClass('totop'); 
            this.html.removeClass('s_showheader').addClass('s_hideheader');
           
     self.header_focused = 0;
     this._rrVideo(10);

    },
    sngineHeaderShowEffect:function(){

            __j('.vy_lv_a1').removeClass('totop'); 
            this.html.addClass('s_showheader').removeClass('s_hideheader');
            
 this._rrVideo(70);

    },
    sngineHeaderEffect:function(){
        const self = this;

        if(!this.s_headerefecthidden)
        setTimeout(function(){
        self.sngineHeaderHideEffect();
        self.s_headerefecthidden = 1;
         },1500);


        /*__j(document).off('mousemove mouseup').on('mousemove mouseup',function(e){
            e.preventDefault();
            e.stopPropagation();

            if(self.header_focused) return false;

            if(e.pageY <= 20) {
                clearTimeout(self.hideheader_timeout);
                self.showheader_timeout = setTimeout(function(){self.sngineHeaderShowEffect();},400); 
            }else{
                clearTimeout(self.showheader_timeout);
                self.hideheader_timeout = setTimeout(function(){self.sngineHeaderHideEffect();},400); 
                } 
        });*/
        __j(document).off('mouseenter mouseover').on('mouseenter mouseover', '.main-header',function(e){
            self.evstop(e,1);
                clearTimeout(self.hideheader_timeout);
                self.showheader_timeout = setTimeout(function(){self.sngineHeaderShowEffect();},100);
        }).off('mouseout mouseleave').on('mouseout mouseleave', '.main-header',function(e){
            self.evstop(e,1);
                clearTimeout(self.showheader_timeout);
                self.hideheader_timeout = setTimeout(function(){self.sngineHeaderHideEffect();},100); 
        });
    },
    removeIntro: function() {
        const self = this;

        this.body.addClass('vy_loaded');
        setTimeout(self.removeIntroElements, 500);
        this.sngineHeaderEffect();

    },
    removeIntroElements: function() {
        __j('#vy_loader-wrapper').remove();
    },
    responsiveForMobiles: function() {

        // remove stream options from bottom (not need for mobile devices)
        __j('#vy_lv_prelivedashboard,#vy_lv_prelive_bsettings').remove();

        this.__onmobiles();
    },
    __onmobiles: function() {

        __j('#vy_lv_container_box,#vy-livest').addClass('__onmobile');
    },
    __onmobiles_watching: function() {

        const self = this;
        __j('#vy-livest').addClass('__onmobilewatching');

        /* disable fullscreen
        if(!this.isIosSafari() && this._is_smartphone() && this.canFullscreen()){
                this.toFullscreen();
                this.is_fullscreen = 1;
        }   */

        if (this.isIosSafari()) {
            $(document).bind(
                'touchmove.vy_lv_plugin2',
                function(e) {
                    e.preventDefault();
                }
            );
        }

    },

    addCommentTxtarea: function(el, evt, id) {

        this.evstop(evt, 1);
        const self = this;
        el = __j(el);
        let _container = __j('.js__vy-lv-comments-section');

        const h = '<div onclick="event.preventDefault();event.stopPropagation();" class="vy_lv_txtaddcomment js__vy_lv_txtaddcomment"><textarea placeholder="' + vy_lvst_lang.write_something + '..." data-meteor-emoji="true" id="vy_lv_txtaddcomment_js"></textarea></div>';

        if (!_container.find('.js__vy_lv_txtaddcomment').length) {
            _container.prepend(h);
            el.hide();

            if (!self._is_smartphone())
                new MeteorEmoji();

            //__j('.vy-live-entry-cnt')
            self.body.off('click.hideTextarea').on('click.hideTextarea', function(e) {

                self.evstop(evt, 1);
                self.timeouts['close_textarea'] = setTimeout(function() {

                    if (!__j("#vy_lv_txtaddcomment_js").is(":focus")) {

                        __j('.js__vy_lv_txtaddcomment').remove();
                        el.show();
                    }
                }, 200);
            });

            __j('#vy_lv_txtaddcomment_js').on('keydown.sendComment', function(e) {


                if (e.keyCode == 13) {

                    if (self.im_muted) {
                        return self.MutedToast();
                    } else {
                        el.show();
                        return self.sendComment(this, id);
                    }
                }

            }).on('focus', function(e) {
                if (self.timeouts.hasOwnProperty('close_textarea')) clearTimeout(self.timeouts['close_textarea']);
                self.evstop(e, 1);
            }).focus();

        }

    },
    sendComment: function(txt_area, id) {

        const self = this;
        const js_txt = __j(txt_area).closest('.js__vy_lv_txtaddcomment');
        const comments = __j('#vy_lv_comments_section');


        if (!$.trim(txt_area.value))
            return txt_area.focus();

        // remove message
        js_txt.remove();

        const data = {
            'cmd': 'addcomment',
            'post_id': escape(id),
            'text': self.encodeHTML(txt_area.value)
        };

        let send = this.jajax(this.ajax_url, 'post', data);
        send.done(function(posted) { console.log('posted',posted)

            if (!posted) {
                $.notify(js_txt, vy_lvst_lang.err_posting_comment + '.', {
                    className: 'error'
                });
            } else {




                comments.append(self.r(self.comment_markup, {
                    '%user_id': vy_lvst_uid,
                    '%moderator': self.isModerator(id, self.im_moderator),
                    '%avatar': vy_lvst_user.p,
                    '%user_name': vy_lvst_user.fn,
                    '%comment': self.encodeHTML(txt_area.value)
                }));
                self.scrollComments(comments, 1);

                self.socket.emit('add_comment', JSON.stringify({
                    'comment': self.encodeHTML(txt_area.value),
                    'live_id': escape(id),
                    'user_id': vy_lvst_user.i,
                    'user_name': vy_lvst_user.fn,
                    'user_avatar': vy_lvst_user.p
                }));

            }


        });



    },
    r: function(html, d) {


        let re = new RegExp(Object.keys(d).join("|"), "gi");
        html = html.replace(re, function(matched) {
            return d[matched];
        });

        return html;


    },
    _btns: function() {
        const self = this;

        self.btn_go = __j('.js__vy_lv_fvbbtgo');
        // open popup privacy button
        __j('#vy_lv_op_privacy').on('click', function(e) {
            self.evstop(e, 1);
            const nm_audience = __j('[name="vy_lv_audience"]'),
                sc_rp = __j('#vy_lv_op_privacy');
            self._popup('select-privacy', {
                'value': escape(nm_audience.val())
            }, function(e) {
                let _a = JSON.parse(vy_lv_privacy_arr),
                    vl = 1;
                const v = document.getElementsByName('vy_lv_audiencev');

                for (var i = 0, length = v.length; i < length; i++) {
                    if (v[i].checked) {
                        vl = v[i].value;
                        _a = _a[vl - 1];
                        break;
                    }
                }
                nm_audience.val(vl);
                self.golive_data['audience'] = vl;
                sc_rp.html('<i class="vy_lv_a15_ic ' + _a.ic + '"></i>' + _a.title);
                self.remove_popups();

            });
        });



        self.btn_go.on('click', function(e) {

            const $descr = __j('#vy_lv_txtemojis');

            if (!$.trim($descr.val())) {

                $descr.addClass('__error');
                $descr.off('keyup.removeErr').on('keyup.removeErr', function(e) {

                    __j(this).removeClass('__error').off('keyup.removeErr')

                });
                $.notify($descr, 'Please describe this live.', {
                    className: 'error'
                });
            } else {

                //  self.goLive($descr.val());
                self.goLive();

            }


        });

    },

    requestCam: async function(v2, mob) {
        const self = this;
        const ResolutionsToCheck = [{
                width: 160,
                height: 120
            },
            {
                width: 320,
                height: 180
            },
            {
                width: 320,
                height: 240
            },
            {
                width: 640,
                height: 360
            },
            {
                width: 640,
                height: 480
            },
            {
                width: 768,
                height: 576
            },
            {
                width: 1024,
                height: 576
            },
            {
                width: 1280,
                height: 720
            },
            {
                width: 1280,
                height: 768
            },
            {
                width: 1280,
                height: 800
            },
            {
                width: 1280,
                height: 900
            },
            {
                width: 1280,
                height: 1000
            },
            {
                width: 1920,
                height: 1080
            },
            {
                width: 1920,
                height: 1200
            },
            {
                width: 2560,
                height: 1440
            },
            {
                width: 3840,
                height: 2160
            },
            {
                width: 4096,
                height: 2160
            }
        ];


        let a17cam = __j('.vy_lv_a17cam');

        let cam_disabled = function(err) {

            self.disable_btn();
            a17cam.removeClass('__none');

            __j('.js__vy-lv-camerr').text('(' + err + ')');
            __j('#vy_lv_a17cam_wait').addClass('__none');
            self.camera_blocked = 1;
        };

        try {

            let constraints = {
                audio: true,
                video: {
                    facingMode: "user"
                }
            };

            if (mob) {
                constraints.audio = {
                    echoCancellation: false
                };
                constraints.video = {
                    width: {
                        min: 1024,
                        ideal: 4096,
                        max: 4096
                    },
                    height: {
                        min: 576,
                        ideal: 2160,
                        max: 2160
                    }
                };

                if (self._is_smartphone()) {
                    constraints.video = {
                        width: 640,
                        height: 480
                    };

                }
                constraints.video['facingMode'] = self.shouldFaceUser ? 'user' : 'environment';
            }

            self.gl_mdevices.c = constraints;
            self.localStream = await navigator.mediaDevices.getUserMedia(constraints);



            if ('permissions' in navigator) {
                navigator.permissions.query({
                    name: 'camera'
                }).then(function(camera_perm) {
                    camera_perm.onchange = function(evt) {

                        if (!(camera_perm.state === "granted")) {
                            cam_disabled(vy_lvst_lang.cam_disabled);

                        }

                        if (self.is_live) {
                            self.stopLive(1);
                        }

                    };
                });
                self.navigator_permission_request = 1;
            }


            const not_granted = !(await navigator.mediaDevices.enumerateDevices())[0].label;

            self.video[0].srcObject = self.localStream;
            await new Promise(r => self.video[0].onloadedmetadata = r);
            a17cam.addClass('__none');
            this.enable_btn();
            if (self.is_live) {

                setTimeout(function() {
                    a17cam.addClass('__none');
                }, 1000);
                self.replaceStreamTracks();

            }
            return 1;
        } catch (err) {

            cam_disabled(err);
            if (!v2) {

                self.remove_cam_err_msg();
                self.show_cam_err_msg();
            }
        }


    },
    requestCam2: function() {

        this.show_cam_err_msg('retry', 1);


        this.requestCam(1);
    },
    camera_err_msg: function(a) {

        return a == 'retry' ? this.camera_retry_markup : this.camera_notfound_markup;

    },
    show_cam_err_msg: function(a, togglecl) {

        let m = this.camera_err_msg(a),
            cam_err_div = __j('#vy_lv_camera_err_msg_markup');

        cam_err_div.html(m);

        if (togglecl) cam_err_div.find('#vy_lv_a17cam_notfound_retry').toggleClass("vy_lv_anim_zoom");

    },
    remove_cam_err_msg: function() {
        __j('#vy_lv_camera_err_msg_markup').empty();
    },
    changeLiveOption: function(e, el) {

        this.evstop(e, 1);
        el = __j(el);
        const opt = el.data('liveoption'),
            _stream_cnt = __j('#vy_lv_stream_set'),
            _camera_cnt = __j('#vy_lv_camera_set');



        if (opt == 'stream') {

            this.disable_btn();

            _camera_cnt.addClass('__none');
            _stream_cnt.removeClass('__none');

            this.startStreamVideo();
            if (this.live_option == 'obs') return;
            this.generateStreamKey();
            this.live_option = 'obs';
        } else {

            __j('#vy_lv_a17cam_wait_stream').addClass('__none');
            __j('#vy_lv_a17cam_wait').removeClass('__none');
            _stream_cnt.addClass('__none');
            _camera_cnt.removeClass('__none');
            //self.video[0].controls = false;
            this.live_option = 'standart';
            //  if(this.camera_blocked)
            if (!el.hasClass('__active'))
                this.requestCam2(1);
            //if(this.live_option == 'standart') return;



        }
        __j('.vy_lv_a23opt.__active').removeClass('__active');
        el.addClass('__active');


        __j([document.documentElement, document.body]).animate({
            scrollTop: __j("#vy_lv_stopts").offset().top
        }, 300);


    },
    _copy: function(el, evt) {

        this.evstop(evt, 1);

        el = __j(el);

        let _default_txt = '';

        const inp = el.parent().parent().find('input');
        const _tsucc = el.find('._tsucc');

        const textToClipboard = function(t) {
            let tt = document.createElement("textarea");
            document.body.appendChild(tt);
            tt.value = t;
            tt.select();
            document.execCommand("copy");
            document.body.removeChild(tt);
        }

        textToClipboard(inp.val());

        _default_txt = _tsucc.text();

        el.find('._tsucc').html('&#10004;');

        setTimeout(function() {
            el.find('._tsucc').html(_default_txt);
        }, 2000);

        $.notify(vy_lvst_lang.copied_to_clipboard + '!', {
            className: 'success'
        });


    },
    stopStream: function() {

        document.getElementById('vy_lv_main_videoel').setAttribute('src', '');
    },
    mobPreparingNewStream: async function(el, ev, callback) {

        const self = this;

        el = __j(el);


        // cancel starting new stream
        if (this.mob_init_countdown) {
            this.mob_init_countdown = false;
            el.removeClass('bactive');

            if (callback)
                callback();

            return self.resetCountdown();
        }


        el.addClass('bactive');


        await self.initCountdown();


        self.destroyCountdown();

        el.fadeOut();


        self.mobStartNewStream(el, ev, callback);



    },
    mobStartNewStream: async function(btn, ev, callback) {

        this.mob_init_countdown = false;

        this.evstop(ev);

        this.goLive(1, function() {

            btn.fadeIn().removeClass('bactive').toggleClass('active').addClass('pulsing');

            if (callback) callback();
        });


    },
    mob_addEventlisteners: function() {
        const self = this;
        let flipBtn = __j('#vy_lv_mob_flip_btn'),
            ripple_go_home = __j('#vy_lv_mob_gohomebtn_ripple'),
            settings = __j('#vy_lv_mob_st_btn'),
            start_stream_btn = __j('#vy_lv_mob_recording_btn'),
            supports = navigator.mediaDevices.getSupportedConstraints();

        self.iosNoBounce();


        // check whether we can use facingMode
        if (supports['facingMode'] === true) {

            flipBtn[0].disabled = false;
            flipBtn.removeClass('__disabled');


            flipBtn.off('click').on('click', function(e) {
                self.evstop(e);

                self.playSound('click');
                if (self.localStream == null) return self.showSwalErr(vy_lvst_lang.device_not_support_flip_mode + '.');
                // we need to flip, stop everything
                self.stopTracks();
                // toggle / flip
                self.shouldFaceUser = !self.shouldFaceUser;
                self.requestCam(1, 1);


            });
        }

        // start stream
        start_stream_btn.on('click.start_stream', function(e) {
            self.evstop(e, 1);

            if (!self.can_stream_now)
                return self.showSwalErr(vy_lvst_lang.we_cant_find_media_source + '.');


            flipBtn.fadeOut(250);
            settings.fadeOut(250);
            ripple_go_home.fadeOut(250);
            self.mobPreparingNewStream(this, e, function() {

                setTimeout(function() {
                    flipBtn.fadeIn(900);
                    settings.fadeIn(900);
                    ripple_go_home.fadeIn(900);
                }, 500);
            });


        });

        // settings button
        settings.on('click.before_stream', async function(e) {
            self.evstop(e);
            self.playSound('click');
            self.mobselect = 1;
            await self.getMobilePopup({
                'title': 'Post',
                'cmd': 'mob_popup',
                'kind': 'mob-pre-live-settings'
            }, 100);

        });
        /* disabled .. maybe in future updates will be enabled :)
        settings.on('click',async function(e){
             self.evstop(e);
             self.playSound('click');
                await self.getMobileCards({'title':'Post', 'cmd': 'mob_popup','kind':'mob-pre-live-settings'}); 
              
          });*/

        // __j('body,html').trigger('click touchend');
        //  self.toFullscreen();
    },

    getMobileCards: function() {

        const self = this;


        const cards_element = __j('<div/>').attr('id', 'z-stack');

        if (!this.body.find('#z-stack').length)
            this.body.find('#vy_lv_container_box').append(cards_element);


        const stackEl = document.getElementById('z-stack');

        // defaults
        const topPosition = 600;
        const backdropOpacity = 0.85;
        const angleValue = 160;
        const offsetYValue = 30;
        const scaleValue = 93;
        const contrastValue = 93;
        let cardsArray = {};

        const select_wheels = [];
        const cards = [{
            'title': vy_lvst_lang.privacy,
            'id': 'privacy'
        }, {
            'title': vy_lvst_lang.title,
            'id': 'title',
        }, {
            'title': vy_lvst_lang.description,
            'id': 'description'
        }, {
            'title': vy_lvst_lang.record,
            'id': 'record'
        }].reverse();
        const cards_content = [
            '<div class="vy_lv__ios-selector_parent"><input type="hidden" value="1" name="vy_lv_audience" /><div id="vy_lv__ios-selector" class="background-gradient1">' + vy_lv_privacy_ops[0].title + '</div></div>',
            '<div class="vy_lv__mobpost_title"><textarea name="vy_lv_title" type="text" placeholder="Aa.." class="vy_lv_mob_newpost_title" maxlength="40"></textarea></div>',
            '<div class="vy_lv__mobpost_title"><textarea name="vy_lv_descr" type="text" placeholder="' + vy_lvst_lang.mob_live_descr + '" class="vy_lv_mob_newpost_title" maxlength="250"></textarea></div>',
            '<div class="vy_lv__mobpost_recording"><div class="vy_lv__mobpost_recording_t">Record stream to timeline</div><label class="el-switch"><input type="checkbox" id="vy_ch_recordingtotimeline" name="vy_record_to_timeline" checked><span class="el-switch-style"></span></label></div>'
        ].reverse();

        const destroyDrawer = function() {
            drawer.destroy({
                animate: true
            });
        };
        const changeOpacity = function(val, transition) {
            const backdrop = document.querySelector('.backdrop');
            const topScreen = topPosition;
            const newScreen = window.screen.height - val;
            const opacity = (backdropOpacity * newScreen) / topScreen;
            if (transition) backdrop.style.transition = transition;
            backdrop.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        }

        const getPaneTransformY = function() {
            const translateYRegex = /\.*translateY\((.*)px\)/i;
            const paneEl = document.querySelector('.pane');
            return paneEl ? parseFloat(translateYRegex.exec(paneEl.style.transform)[1]) : 0;
        }




        for (let i = 0; i < vy_lv_privacy_ops.length; i++) {
            select_wheels.push(vy_lv_privacy_ops[i].title);

        }


        const openCardZStack = function(index, animate) {
            for (let i = cards.length - 1; i > index; i--) {
                let isCardExist = (!!document.querySelector(`.cupertino-pane-wrapper.card-${i}`));
                if (isCardExist) {
                    cardsArray[i].destroy({
                        animate
                    });
                }
            }

            for (let i = 0; i <= index; i++) {
                let isCardExist = (!!document.querySelector(`.cupertino-pane-wrapper.card-${i}`));
                if (!isCardExist) {
                    cardsArray[i].present({
                        animate
                    });
                }
            }
        }




        const dragZStack = function(ev, current) {
            if (current === cards.length - 1) {
                return;
            }

            if (ev.delta > 70) {
                cardsArray[current].disableDrag();
                openCardZStack(current + 1, true);
            }
        }

        const dismissZStack = function(ev, current) {
            cardsArray[current - 1]?.enableDrag();
        }



        cardsArray = {};
        stackEl.innerHTML = '';

        let settings = {
            initialBreak: 'top',
            animationDuration: 300,

            breaks: {
                top: {
                    enabled: true,
                    height: window.innerHeight - window.innerHeight / 1.5
                },
                middle: {
                    enabled: false
                }
            },
            showDraggable: true,
            buttonClose: true,
            zStack: {
                stackZAngle: angleValue,
                cardYOffset: offsetYValue,
                cardContrast: contrastValue / 100,
                cardZScale: scaleValue / 100,
                pushElements: null,
                minPushHeight: 100
            },
            topperOverflow: false,
            bottomClose: true,
            onDidDismiss: () => self.mobCards_close(cards_element),
            onBackdropTap: () => destroyDrawer()
        };



        for (let i = 0; i < cards.length; i++) {
            // Insert html card
            stackEl.insertAdjacentHTML('beforeend', `<div id="pane-${i}"><h1>${cards[i].title}</h1><p hide-on-bottom>${cards_content[i]}</p></div>`);

            if (cards[i].id == 'privacy') {

                let mobileSelect1 = new MobileSelect({
                    trigger: '#vy_lv__ios-selector',
                    cancelBtnText: vy_lvst_lang.cancel,
                    ensureBtnText: vy_lvst_lang.confirm,
                    title: cards[i].title,
                    wheels: [{
                        data: select_wheels
                    }],
                    position: [0],
                    transitionEnd: function(indexArr, data) {
                        //console.log(data);
                    },
                    callback: function(indexArr, data) {
                        //console.log(data);
                    }
                });
            }

            let itemSettings = {
                ...settings,
                cssClass: `card-${i}`,
                onDrag: (e) => dragZStack(e, i),
                onDidDismiss: (e) => dismissZStack(e, i)
            }

            let pushedEls = new Array(i).fill('.cupertino-pane-wrapper.card-');
            pushedEls = pushedEls.map((item, index) => `${item}${index}`);
            if (pushedEls.length) {
                itemSettings.zStack = {
                    ...itemSettings.zStack,
                    pushElements: pushedEls
                };
            }

            if (i === 0) {
                itemSettings.breaks = {
                    ...settings.breaks,
                    ...{
                        bottom: {
                            enabled: false
                        }
                    }
                };
                itemSettings.bottomClose = false;
                itemSettings.zStack = null;
            }

            cardsArray[i] = new CupertinoPane(`#pane-${i}`, itemSettings);
        }

        openCardZStack(cards.length - 1, true);



    },
    mobCards_close: function(cards) {

        this.body.find('#z-stack').remove();

    },
    getMobilePopup: function(data, popup_id) {

        const self = this;

        if (self.body.find('#vy_lv__mob_popup').length) {
            return true;

        }

        if (popup_id && self.mob_popups.hasOwnProperty(popup_id)) {

            return self.mobPopup_show(self.mob_popups[popup_id], 1);
        }

        self._loading();

        return new Promise(async (resolve, reject) => {



            let getPopup = this.jajax(this.ajax_url, 'post', data);
            getPopup.done(function(popup) {
                self._rLoading();

                popup = __j(popup);
                popup.find('#vy_lv_mob_popup__title').text(data.title);

                self.mobPopup_show(popup);
                if (popup_id)
                    self.mob_popups[popup_id] = popup;

                resolve(true);

            });
        });
    },
    mobPopup_show: function(popup, reload) {

        const self = this;



        self.body.prepend(popup);

        self.callCupertino(popup, reload);

        //popup.addClass('show');

    },
    mobPopup_close: function(popup) {

        const self = this;


        popup.remove();

    },
    callCupertino: function(popup, reload) {
        const self = this;
        const destroyDrawer = function() {
            self.cupertino_drawer.destroy({
                animate: true
            });
        };
        const changeOpacity = function(val, transition) {
            const backdrop = document.querySelector('.backdrop');
            const topScreen = topPosition;
            const newScreen = window.screen.height - val;
            const opacity = (backdropOpacity * newScreen) / topScreen;
            if (transition) backdrop.style.transition = transition;
            backdrop.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        }

        const getPaneTransformY = function() {
            const translateYRegex = /\.*translateY\((.*)px\)/i;
            const paneEl = document.querySelector('.pane');
            return paneEl ? parseFloat(translateYRegex.exec(paneEl.style.transform)[1]) : 0;
        }

        let mobileSelect1 = function() {};
        const topPosition = 600;
        const backdropOpacity = 0.85;
        self.cupertino_drawer = new CupertinoPane('ion-drawer', {
            backdrop: true,
            initialBreak: 'middle',
            fastSwipeClose: true,
            breaks: {
                top: {
                    enabled: true,
                    height: topPosition
                },
                middle: {
                    enabled: true,
                    height: 300
                },
                bottom: {
                    enabled: false
                }
            },
            backdropOpacity,
            onDidDismiss: () => self.mobPopup_close(popup),
            onBackdropTap: () => destroyDrawer(),
            onDrag: () => changeOpacity(getPaneTransformY(), 'unset'),
            onTransitionStart: (e) => changeOpacity(e.translateY.new, 'all 300ms ease 0s')
        });
        setTimeout(() => self.cupertino_drawer.present({
            animate: true
        }));

        const select_wheels = [];

        for (let i = 0; i < vy_lv_privacy_ops.length; i++) {
            select_wheels.push({
                'id': vy_lv_privacy_ops[i].id,
                'value': vy_lv_privacy_ops[i].title
            });

        }
        if (!reload && self.mobselect) {
            mobileSelect1 = new MobileSelect({
                trigger: '#vy_lv__ios-selector',
                cancelBtnText: vy_lvst_lang.cancel,
                ensureBtnText: vy_lvst_lang.confirm,
                title: 'Privacy',
                wheels: [{
                    data: select_wheels
                }],
                position: [0],
                transitionEnd: function(indexArr, data) {


                },
                callback: function(indexArr, data) {

                    self.golive_data['audience'] = data[0].id
                }
            });
            self.mobselect = 0;
        }

    },
    showSwalErr: function(t) {
        const self = this;
        Swal.fire(
            vy_lvst_lang.error,
            t,
            'error'
        );

        setTimeout(function() {
            self.playSound('openpopup');
        }, 50);

    },
    createSounds: function() {

        const self = this;

        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.on("fileload", function() {}, this);

        for (var i in vy_lvst_sounds)
            createjs.Sound.registerSound(vy_lvst_sounds[i], i);



    },
    playSound: function(id) {

        const instance = createjs.Sound.play(id);
        instance.on("complete", function() {}, this);
        instance.volume = this.soundVolume;

    },
    isFullScreen: function() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    },
    exitFullscreen: function() {

        if (this.isFullScreen()) {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

        }


    },
    canFullscreen: function() {

        for (const key of [
                'exitFullscreen',
                'webkitExitFullscreen',
                'webkitCancelFullScreen',
                'mozCancelFullScreen',
                'msExitFullscreen',
            ]) {
            if (key in document) {
                return true;
            }
        }
        return false;
    },
    toFullscreen: function(evt, new_elem) {
        const self = this;


        let _element = __j('body').get(0);

        if (_element.requestFullscreen) {
            _element.requestFullscreen();
        } else if (_element.mozRequestFullScreen) {
            _element.mozRequestFullScreen();
        } else if (_element.webkitRequestFullscreen) {
            _element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (_element.msRequestFullscreen) {
            _element.msRequestFullscreen();
        }

        if (self.canFullscreen()) {

            __j('html').addClass('vy_lv-fullscreen');


        } else {
            if (!self.isIosSafari()) self.showSwalErr(vy_lvst_lang.fullscreen_not_supported);
            console.log(vy_lvst_lang.fullscreen_not_supported)
        }

    },
    stopTouchMove: function() {
        if( (__j('#vy_lv_container_box').length && this._is_smartphone()) || (__j('#vy-livest').length && this._is_smartphone()))
        __j(document.body).on("touchmove.vy_lv_plugin1", function(event) {
            event.preventDefault();
            event.stopPropagation();
        });
    },
    resetCountdown: function(destroy) {
        const self = this;
        const countdowncontainer = __j('#timer--mobBstream');
        clearInterval(self._intervals['countdown']);
        clearTimeout(self.timeouts['countdown']);
        countdowncontainer.addClass('__none');

        if (destroy)
            countdowncontainer.remove();

    },
    destroyCountdown: function() {
        this.resetCountdown(1);
    },
    initCountdown: function() {
        const self = this;
        this.mob_init_countdown = true;
        return new Promise((resolve, reject) => {
            let countdownNumberEl = __j('#mob_ready_countdown-number2'),
                countdowncontainer = __j('#timer--mobBstream');
            let countdown = self.countdown_seconds;

            countdowncontainer.removeClass('__none');

            countdownNumberEl[0].textContent = countdown;
            self.playSound('countdown');
            self._intervals['countdown'] = setInterval(function() {
                countdown = --countdown < 0 ? self.countdown_seconds : countdown;

                countdownNumberEl[0].textContent = countdown;


                if (countdown == 1) {
                    self.timeouts['countdown'] = setTimeout(function() {
                        countdowncontainer.addClass('__none');
                        return resolve(true);
                    }, 900);
                }
                self.playSound('countdown');
            }, 1000);

        });

    },
    destroy_flvplayer: function() {

        if (this.flvPlayer != null)
            this.flvPlayer.destroy();

    },
    construct_FLVPlayer: function(stream_path) {


        if (flvjs.isSupported()) {

            let videoElement = document.getElementById('vy_lv_main_videoel');
            this.flvPlayer = flvjs.createPlayer({
                "type": "flv",
                "url": vy_lvst_rtmp_url + stream_path + '.flv',
                "isLive": true

            });
            this.flvPlayer.attachMediaElement(videoElement);
            this.flvPlayer.load();
            this.flvPlayer.play();

        } else {
            self.showSwalErr(vy_lvst_lang.err_flv_player_not_supported + '.');


        }



    },
    enumerateMediaDevices: function() {
        const self = this;
        const videoElement = document.querySelector('video#vy_lv_main_videoel');
        const audioInputSelect = document.querySelector('select#vy_lv_select_audioSource');
        const audioOutputSelect = document.querySelector('select#vy_lv_select_audioOutput');
        const videoSelect = document.querySelector('select#vy_lv_select_videoSource');
        const selectors = [audioInputSelect, audioOutputSelect, videoSelect];




        const gotDevices = function(deviceInfos) {

            for (var i = 0; i !== deviceInfos.length; ++i) {
                var deviceInfo = deviceInfos[i];
                var option = document.createElement('option');
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'audioinput') {
                    option.text = deviceInfo.label ||
                        'Microphone ' + (audioInputSelect.length + 1);
                    audioInputSelect.appendChild(option);
                } else if (deviceInfo.kind === 'audiooutput') {
                    option.text = deviceInfo.label || 'Speaker ' +
                        (audioOutputSelect.length + 1);
                    audioOutputSelect.appendChild(option);
                } else if (deviceInfo.kind === 'videoinput') {
                    option.text = deviceInfo.label || 'Camera ' +
                        (videoSelect.length + 1);
                    videoSelect.appendChild(option);
                }


            }

            __j(audioInputSelect).children().eq(0).attr('selected', true);
            __j(audioOutputSelect).children().eq(0).attr('selected', true);
            __j(videoSelect).children().eq(0).attr('selected', true);
            self.gl_mdevices.a = audioInputSelect.value;
            self.gl_mdevices.v = videoSelect.value;
        }
        const errorCallback = function() {
            alert('No media input enabled.');

        }



        const gotStream = function(stream) {
            window.stream = stream; // make stream available to console
            videoElement.srcObject = stream;
            // Refresh button list in case labels have become available
            return navigator.mediaDevices.enumerateDevices();
        }

        const handleError = function(error) {
            console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
        }
        // Attach audio output device to video element using device/sink ID.
        const attachSinkId = function(element, sinkId) {
            if (typeof element.sinkId !== 'undefined') {
                element.setSinkId(sinkId)
                    .then(() => {
                        console.log(`Success, audio output device attached: ${sinkId}`);
                    })
                    .catch(error => {
                        let errorMessage = error;
                        if (error.name === 'SecurityError') {
                            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                        }
                        console.error(errorMessage);
                        // Jump back to first output device in the list as it's the default.
                        audioOutputSelect.selectedIndex = 0;
                    });
            } else {
                console.warn('Browser does not support output device selection.');
            }
        }
        const changeAudioDestination = function() {
            const audioDestination = audioOutputSelect.value;
            attachSinkId(videoElement, audioDestination);
        }
        const start = function() {
            if (window.stream) {
                window.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }
            self.gl_mdevices.a = audioInputSelect.value;
            self.gl_mdevices.v = videoSelect.value;
            self.gl_mdevices.c = {
                audio: {
                    deviceId: self.gl_mdevices.a ? {
                        exact: self.gl_mdevices.a
                    } : undefined
                },
                video: {
                    deviceId: self.gl_mdevices.v ? {
                        exact: self.gl_mdevices.v
                    } : undefined
                }
            };
            navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
        }




        audioInputSelect.onchange = start;
        audioOutputSelect.onchange = changeAudioDestination;

        videoSelect.onchange = start;

        navigator.mediaDevices.enumerateDevices()
            .then(gotDevices)
            .catch(errorCallback);

    },
    stopStreamedVideo: function() {

        if (!this.localStream) return;

        this.stopTracks();

        if (this.video && typeof this.video[0] != 'undefined')
            this.video[0].srcObject = null;
    },
    startStreamVideo: function() {
        const self = this,
            _stream_waiting_txt = __j('#vy_lv_a17cam_wait_stream');

        this.stopStreamedVideo();

        //self.video[0].controls = true;

        _stream_waiting_txt.removeClass('__none');
        this.remove_cam_err_msg();


    },

    goLive: function(mob, callback) {

        const self = this;

        // prevent duplicate posting post
        if (self.lastClick >= (Date.now() - self.lastclick_delay))
            return;



        self.lastClick = Date.now();
        self._loading();
        const data = {};




        data['cmd'] = 'golive';
        data['descr'] = this.golive_data['description'];
        data['privacy'] = this.golive_data['audience'];
        data['title'] = this.golive_data['title'];
        data['obs'] = 'no';
        data['post_to_timeline'] = "no";


        if (vy_lv_recording) {

            self.post_to_timeline = this.golive_data['record'];
            data['post_to_timeline'] = this.golive_data['record'];

        }

        if (self.obs_stream) {
            data['obs'] = 'yes';
            data['stream_name'] = self.obs_stream_name;
        }

        if (self.page_id > 0)
            data['page_id'] = self.page_id;

        if (self.group_id > 0)
            data['group_id'] = self.group_id;

        let send = this.jajax(this.ajax_url, 'post', data);
        send.done(function(d) {  
            self._rLoading();
            if (callback) callback();
            //  self.checkNetworkStatus();
            self.resetGoLiveData();


            d = self.validateJson(d);

            self.live_id = d.post_id;
            self.broadcast_id = d.broadcast_id;
            self.broadcastData(self.live_id);
            self.filename = d.filename;

            if (!mob)
                self.changeLiveDashboard(self.live_id);
            else
                __j('#vy_lv_mob_gohomebtn_ripple').remove();



            self.liveStats();

            self.start_timer();
            self.is_live = 1;
            self.author = vy_lvst_uid;
            self.im_host = 1;
            self.blocked_users[self.live_id] = new Array();
            self.muted_users[self.live_id] = new Array();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            if (!mob)
                Toast.fire({
                    icon: 'success',
                    title: vy_lvst_lang.you_are_live_now + '!'
                });

            if (mob) {
                self.reGenerateMobBtnFunc();
                __j('#vy_lv_mob_opinv_comm').removeClass('__none');
            }

            self.playSound('success');

            self.body.addClass('vy_lv_streaming');

            if (mob || vy_lvst_away_desktop) {

                __j([document, window]).off("visibilitychange.vy_live_away").on("visibilitychange.vy_live_away", function(e) {
                    self.evstop(e);
                    if (document.visibilityState === 'visible') {
                        self.removeAway();
                    } else {
                        self.setAway();
                    }

                });
            }



            if (self.isIosSafari()) {

                window.addEventListener("pagehide", function(event) {
                    window.event.cancelBubble = true; // Don't know if this works on iOS but it might!
                    return self.stopLive(1);
                });
            } else {

                __j(window).off("unload.vy-livestop beforeunload.vy-livestop").on("unload.vy-livestop beforeunload.vy-livestop", function(e) {

                    return self.stopLive(1);


                });
            }


            /*.off('focus.vy-livestop').on('focus.vy-livestop',function(){
                            self.didEnterBeforeUnload = false;
                        });*/

            // start recording
            if (vy_lv_recording && self.post_to_timeline == "yes") {

                if (!self.obs_stream)
                    self.onstreamv2();

            }

            self.generateCover(d.post_id);

        });


    },
    generateCover: function(id) {

        const self = this;
        let canvas = document.getElementById('vy-lv-cover');
        let video = self.video[0];

        // Calculate the ratio of the video's width to height
        let ratio = video.videoWidth / video.videoHeight;
        // Define the required width as 100 pixels smaller than the actual video's width
        let w = video.videoWidth - 100;
        // Calculate the height based on the video's width and the ratio
        let h = parseInt(w / ratio, 10);


        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(video, 0, 0, w, h);

        let send = this.jajax(this.ajax_url, 'post', {
            cmd: 'generateCover',
            id: id,
            cover: canvas.toDataURL('image/png')
        });

    },
    setAway: function() {

        const self = this;
        self.socket.emit('vy_lv_away', self.live_id);


    },
    removeAway: function() {
        const self = this;
        self.socket.emit('vy_lv_rm_away', self.live_id);
    },
    mobstf: async function(ev, el) {

        const self = this;

        self.evstop(ev, 1);

        el = __j(el);

        const Live_ID = el.data('id');
        const k = el.data('kind');
        const title = el.data('title');

        let users = new Array(),
            cmd = {
                'cmd': 'mob_popup'
            };

        self.playSound('click');

        switch (k) {

            case 'viewers':
                users = await self.getViewers(Live_ID);
                cmd['kind'] = 'get-viewers';
                break;
            case 'new-moder':
                users = await self.getViewers(Live_ID);
                cmd['kind'] = 'get-available-for-moder';
                break;
            case 'remove-moder':
                users = await self.getViewers(Live_ID, 1);
                cmd['kind'] = 'remove-moderators';
                break;

        }

        cmd['users'] = JSON.stringify(users);
        cmd['title'] = title;
        cmd['id'] = escape(self.live_id);
        cmd['cmd'] = 'mob_popup';




        if (self.cupertino_drawer != null) {
            self.cupertino_drawer.destroy();
        }

        await self.getMobilePopup(cmd);

    },

    reGenerateMobBtnFunc: function() {
        const self = this;
        let btn_r = __j('#vy_lv_mob_recording_btn'),
            btn_s = __j('#vy_lv_mob_st_btn'),
            btn_f = __j('#vy_lv_mob_flip_btn');

        btn_r.off('click.start_stream').on('click.stop_stream', function(e) {
            self.evstop(e, 1);

            return self.beforeStopLive();
        });

        // settings button click event in streaming
        btn_s.off('click.before_stream').on('click.in_stream', async function(e) {
            self.evstop(e);

            self.playSound('click');

            await self.getMobilePopup({
                'title': vy_lvst_lang.settings,
                'id': escape(self.live_id),
                'cmd': 'mob_popup',
                'kind': 'mob-streaming-settings'
            });

        });

    },
    stopMediaRecorder: function() {

        if (this.mediaRecorder != null && this.mediaRecorder.state == 'recording')
            this.mediaRecorder.stop();
    },
    onstreamv2: function() {

        const self = this;
        //self.filename = self.generateFilename();
        self.videoTrack = self.localStream.getVideoTracks()[0];
        self.audioTrack = self.localStream.getAudioTracks()[0];
        self.mediaStream.addTrack(self.videoTrack);
        self.mediaStream.addTrack(self.audioTrack);
        const recorderOptions = {
            audioBitsPerSecond: vy_lv_recording_audio_bits,
            videoBitsPerSecond: vy_lv_recording_video_bits,
            mimeType: 'video/webm'
        };
        self.mediaRecorder = new MediaRecorder(self.mediaStream, recorderOptions);


        self.mediaRecorder.start(vy_lv_recording_fr_msec);
        self.mediaRecorder.ondataavailable = (event) => {

            if (event.data && event.data.size > 0 && !self.live_stopped) {
                self.socket.emit("recording", event.data, vy_lvst_uid, self.filename);
            }
        };

    },
    onstream: function() {
        const self = this;

        self.recordAudio = RecordRTC(self.localStream, {
            type: 'audio',
            recorderType: StereoAudioRecorder,
            // bufferSize: 16384,
            onAudioProcessStarted: function() {
                self.recordVideo.startRecording();
            }
        });

        let videoOnlyStream = new MediaStream();
        videoOnlyStream.addTrack(self.localStream.getVideoTracks()[0]);
        self.recordVideo = RecordRTC(videoOnlyStream, {
            type: 'video',
            // recorderType: MediaStreamRecorder || WhammyRecorder
        });

        self.recordAudio.startRecording();


    },
    replaceStreamTracks: function(id) {


        const self = this;
        if (vy_lvst.webRtcPeer == null) return this.showSwalErr('Error while trying to switch your video source, please try again.');
        vy_lvst.webRtcPeer.peerConnection.getSenders().map(function(sender) {
            sender.replaceTrack(self.video[0].srcObject.getTracks().find(function(track) {
                return track.kind === sender.track.kind;
            }));
        });


    },
    broadcastData: async function(live_id, reconnect) {

        const self = this;
        const is_rtmp = self.obs_stream ? true:false;
        if (reconnect) {
            vy_lvst.webRtcPeer = null;
            self.socket.emit("reconnect_join", live_id, is_rtmp);
        } else {
            self.socket.emit("broadcaster", live_id, is_rtmp);
        }

        if (Object.keys(this.config).length <= 0) {

            await self.getTurnCredentials();

        }

        if(reconnect && vy_lvst.obs_stream) return;

        if(vy_lvst.obs_stream){

            vy_lvst.play_muted_video(self.video);
        } else {

        vy_lvst._wss_connect(live_id, function() {
            vy_lvst.presenter(reconnect);
            vy_lvst.play_muted_video(vy_lvst.video);
        });
    }

    },
    getViewers: async function(id, only_moders) {
        const self = this;
        self._loading();

        let send_data = {
            "id": id,
            "only_moders": "no"
        };

        if (only_moders)
            send_data['only_moders'] = "yes";

        let data = null;
        await $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/getviewers',
            contentType: 'application/json',
            data: JSON.stringify(send_data),
            type: 'POST',
            success: function(d) {

                data = d;
                self._rLoading();
            },
            error: function(xhr, status, error) {
                self._rLoading();
                console.log('Error: ' + error.message);
                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);


            },
        });
        return data;
    },
    openSettings: async function(el, evt, Live_ID) {

        const self = this;
        this.evstop(evt, 1);

        if (!Live_ID) return;

        let cnt = await self._popup('live-settings', {
                'value': escape(Live_ID)
            }),
            btn_viewers = cnt.find('#vy_lv_block_visitors'),
            btn_add_moder = cnt.find('#vy_lv_add_moderators'),
            btn_remove_moder = cnt.find('#vy_lv_remove_moderators'),
            btn_end_live = cnt.find('#vy_lv_end_live'),
            cnt_popup = cnt.find('.vy_lvst_setings_dv_cnt'),
            hide_btns = function() {

                cnt.find('.vy_lvst_settings_btns').hide();

            },
            show_btns = function() {

                cnt.find('.vy_lvst_settings_btns').fadeIn();

            };




        btn_viewers.off('click').on('click', async function(e) {
            self.evstop(e, 1);

            let users = await self.getViewers(Live_ID)


            self._loading();


            const d = {
                'cmd': 'get-viewers',
                'id': escape(Live_ID),
                'users': JSON.stringify(users)
            };
            const g = self.jajax(this.ajax_url, 'post', d);
            g.done(function(h) {

                self._rLoading();
                hide_btns();

                cnt_popup.html(h);


                cnt_popup.find('#vy_lvst_popup_back').off('click').on('click', function(e) {

                    self.evstop(e, 1);

                    cnt_popup.empty();
                    show_btns();

                });

            });


        });

        btn_add_moder.off('click').on('click', async function(e) {
            self.evstop(e, 1);
            let users = await self.getViewers(Live_ID)



            self._loading();


            const d = {
                'cmd': 'get-available-for-moder',
                'id': escape(Live_ID),
                'users': JSON.stringify(users)
            };
            const g = self.jajax(this.ajax_url, 'post', d);
            g.done(function(h) {

                self._rLoading();
                hide_btns();

                cnt_popup.html(h);


                cnt_popup.find('#vy_lvst_popup_back').off('click').on('click', function(e) {

                    self.evstop(e, 1);

                    cnt_popup.empty();
                    show_btns();

                });

            });
        });

        btn_remove_moder.off('click').on('click', async function(e) {
            self.evstop(e, 1);
            let users = await self.getViewers(Live_ID, 1)



            self._loading();


            const d = {
                'cmd': 'remove-moderators',
                'id': escape(Live_ID),
                'users': JSON.stringify(users)
            };
            const g = self.jajax(this.ajax_url, 'post', d);
            g.done(function(h) {

                self._rLoading();
                hide_btns();

                cnt_popup.html(h);


                cnt_popup.find('#vy_lvst_popup_back').off('click').on('click', function(e) {

                    self.evstop(e, 1);

                    cnt_popup.empty();
                    show_btns();

                });

            });
        });

        btn_end_live.off('click').on('click', function(e) {
            self.evstop(e, 1);


            self.beforeStopLive();

        });

    },
    beforeStopLive: function() {
        const self = this;

        if (self.current_min < 1 && self.post_to_timeline == 'yes' && vy_lv_recording) {

            return self.confirmDeletingShortStreams();

        }

        Swal.fire({
            title: vy_lvst_lang.q_are_you_sure_you_want_to_end_broadcast,
            text: vy_lvst_lang.you_won_be_able_to_revert_this + '!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: vy_lvst_lang.yes_im_done + '!',
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {

            if (result.isConfirmed) {

                self.stopLive();
            }
        });



    },
    unMuteViewer: function(evt, el, id, Live_ID) {
        const self = this;
        this.evstop(evt, 1);

        el = __j(el);

        Swal.fire({
            title: vy_lvst_lang.are_you_sure,
            text: vy_lvst_lang.please_confirm_you_want_to_unmute + ".",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#82b440',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.yes_unmute_him + '!',
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self._loading();
                self.unMuteUser(id, Live_ID);

            }
        });

    },
    unBlockViewer: function(evt, el, id, Live_ID) {
        const self = this;
        this.evstop(evt, 1);

        el = __j(el);

        Swal.fire({
            title: vy_lvst_lang.are_you_sure,
            text: vy_lvst_lang.please_confirm_you_want_to_unblock + ".",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#82b440',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.yes_unblock_him + '!',
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self._loading();
                self.unBlockUser(id, Live_ID);

            }
        });

    },
    muteViewer: function(evt, el, id, Live_ID) {
        const self = this;
        this.evstop(evt, 1);

        el = __j(el);

        Swal.fire({
            title: vy_lvst_lang.are_you_sure,
            text: vy_lvst_lang.if_user_is_muted + ".",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.yes_mute_him + '!',
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self._loading();
                self.MuteUser(id, Live_ID);

            }
        });

    },
    blockViewer: function(evt, el, id, Live_ID) {
        const self = this;
        this.evstop(evt, 1);

        el = __j(el);

        Swal.fire({
            title: vy_lvst_lang.are_you_sure,
            text: vy_lvst_lang.confirm_that_you_want_to_block + ".",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.yes_block_him + '!',
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self._loading();
                self.blockUser(id, Live_ID);

            }
        });

    },
    addModerator: function(evt, el, id, Live_ID) {
        const self = this;
        this.evstop(evt, 1);

        el = __j(el);

        Swal.fire({
            title: vy_lvst_lang.are_you_sure,
            text: vy_lvst_lang.once_you_make_moderator_info + ".",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.yes_make_it_moder + '!',
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self._loading();
                self.makeModerator(id, Live_ID);

            }
        });

    },
    removeModerator: function(evt, el, id, Live_ID) {
        const self = this;
        this.evstop(evt, 1);

        el = __j(el);

        Swal.fire({
            title: vy_lvst_lang.are_you_sure,
            text: vy_lvst_lang.the_user_will_be_removed_from_your_moderators + ".",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.yes_remove_moderator + '!',
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self._loading();
                self.deleteModerator(id, Live_ID);

            }
        });

    },
    unMuteUser: function(id, Live_ID) {
        const self = this;

        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/unmuteViewer',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "Live_ID": Live_ID,
                "by_user_fullname": encodeURIComponent(vy_lvst_user.fn)
            }),
            type: 'POST',
            success: function(d) {
                __j('#vy_lv_muted_viewer_' + id).remove();
                self._rLoading();


                Swal.fire(
                    vy_lvst_lang.unmuted + '!',
                    vy_lvst_lang.notif_unmuted_info + '.',
                    'success'
                );
                self.playSound('openpopup');


            },
            error: function(xhr, status, error) {
                console.log('Error: ' + error.message);
                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);

            },
        });



    },
    unBlockUser: function(id, Live_ID) {
        const self = this;

        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/unblockViewer',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "Live_ID": Live_ID,
                "by_user_fullname": encodeURIComponent(vy_lvst_user.fn)
            }),
            type: 'POST',
            success: function(d) {
                __j('#vy_lv_blocked_viewer_' + id).remove();
                self._rLoading();

                /*if(self.blocked_users.hasOwnProperty(Live_ID)){
                    
                    if(self.findinObj(self.blocked_users[Live_ID],id))
                        self.blocked_users[Live_ID].splice(self.blocked_users[Live_ID].indexOf(id),1);
                    
                }*/

                Swal.fire(
                    vy_lvst_lang.unblocked + '!',
                    vy_lvst_lang.the_user_has_been_unblocked + '.',
                    'success'
                );
                self.playSound('openpopup');

            },
            error: function(xhr, status, error) {
                console.log('Error: ' + error.message);

                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);
            },
        });



    },
    deleteModerator: function(id, Live_ID) {
        const self = this;

        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/removeModerator',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "Live_ID": Live_ID,
                "by_user_fullname": encodeURIComponent(vy_lvst_user.fn)
            }),
            type: 'POST',
            success: function(d) {
                __j('#vy_lv_viewer_' + id).remove();
                self._rLoading();
                Swal.fire(
                    vy_lvst_lang.removed + '!',
                    vy_lvst_lang.user_is_no_longer_your_moder + '.',
                    'success'
                );
                self.playSound('openpopup');


            },
            error: function(xhr, status, error) {
                console.log('Error: ' + error.message);

                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);
            },
        });



    },
    makeModerator: function(id, Live_ID) {
        const self = this;

        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/makeModerator',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "Live_ID": Live_ID,
                "by_user_fullname": encodeURIComponent(vy_lvst_user.fn)
            }),
            type: 'POST',
            success: function(d) {
                __j('#vy_lv_viewer_' + id).remove();
                self._rLoading();
                Swal.fire(
                    vy_lvst_lang.added + '!',
                    vy_lvst_lang.this_user_its_your_moderator + '.',
                    'success'
                );
                self.playSound('openpopup');

            },
            error: function(xhr, status, error) {
                console.log('Error: ' + error.message);

                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);
            },
        });



    },
    blockUser: function(id, Live_ID) {
        const self = this;

        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/blockViewer',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "Live_ID": Live_ID,
                "by_user_fullname": encodeURIComponent(vy_lvst_user.fn)
            }),
            type: 'POST',
            success: function(d) {
                __j('#vy_lv_viewer_' + id).remove();
                self._rLoading();
                /*self.blocked_users[Live_ID].push(id);*/
                Swal.fire(
                    vy_lvst_lang.blocked + '!',
                    vy_lvst_lang.this_user_will_not_be_able_to_see_your_stream + '.',
                    'success'
                );
                self.playSound('openpopup');

            },
            error: function(xhr, status, error) {
                console.log('Error: ' + error.message);
                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);
            },
        });



    },
    MuteUser: function(id, Live_ID) {
        const self = this;

        $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/muteViewer',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": id,
                "Live_ID": Live_ID,
                "by_user_fullname": encodeURIComponent(vy_lvst_user.fn)
            }),
            type: 'POST',
            success: function(d) {
                __j('#vy_lv_viewer_' + id).remove();
                self._rLoading();
                /*self.muted_users[Live_ID].push(id);*/
                Swal.fire(
                    vy_lvst_lang.muted + '!',
                    vy_lvst_lang.this_user_can_not_send_comments_anymore + '.',
                    'success'
                );
                self.playSound('openpopup');
            },
            error: function(xhr, status, error) {
                console.log('Error: ' + error.message);
                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);
            },
        });



    },
    searchInViewers: function(evt, el) {

        var input, filter, ul, li, a, i, txtValue;
        input = el;
        filter = input.value.toUpperCase();
        ul = __j("#vy_lvst_viewers_ul");
        if (!ul.length) return;
        li = ul[0].getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("username")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    },
    showViewerOpts: function(el, evt) {
        const self = this;

        self.evstop(evt, 1);

        el = __j(el);

        el.find('.js__lvst_pcontact_name').hide();
        el.find('.js__vy_lvst_viewer_mng').removeClass('__none');

    },
    changeLiveDashboard: function(id) {
        const self = this;
        __j('.vy_lv_a20opt,.vy_lv_a20opt,.vy_lv_a6s').remove();
        __j('.vy_lv_a4cp').find('.js__vy_lv_ajax_loading1').removeClass('__none');
        __j('.vy_lv_a1').css('position', 'fixed');

        const data = {
            'cmd': 'showdashboard',
            'id': escape(id)
        };


        let send = this.jajax(this.ajax_url, 'post', data);
        send.done(function(dashboard_html) {
            self.is_live = 1;
            __j('.vy_lv_a4cp').replaceWith(dashboard_html);

            self.cnt = __j('.vy_lvst_js__dashboard');



            self.responsiveinLiveDesktop();

            __j(window).on('resize.vy_lvst', function() {
                self.responsiveinLiveDesktop();
            });


        });

    },
    liveStats: function() {

        __j('.js__au4x2').removeClass('__none');

    },
    responsiveinLiveMob: function() {

        const h = __j(window).height();

        if (this.is_live) {
            __j('#vy_lv_container_box').height(h);
            __j('#vy_lv_rtmpv').height(h);

        }


    },
    responsiveinLiveDesktop: function() {

        const h = __j(window).height() - __j('header.header-container > div').outerHeight();

        if (this.is_live) {
            __j('#vy_lv_container_box').height(h - 40);
            __j('#vy_lv_rtmpv').height(h + 1); //h - 45);

        }


    },
    stopObsfirst: function(_remove) {
        const self = this;

        const _rm = _remove || false;
        /*
          if(_remove){
              
              self.socket.emit('delete_obs_record',self.obs_stream_p,vy_lvst_uid);
          }
          */

        self.obs_stream = 0;
        this.socket.emit('stop_obs_manually', vy_lvst_muid, vy_lvst_uid, _remove);

    },
    toFormData: function(o) {
        return Object.entries(o).reduce((d, e) => (d.append(...e), d), new FormData())
    },
    stopLiveAfterAjax: function() {
        const self = this;
        self.clearVars();
        self.stopMediaRecorder();
        self.removePopups();
        self.unbindEvents();
        Swal.fire({
            title: vy_lvst_lang.ended + '!',
            text: vy_lvst_lang.live_has_been_ended + "!",
            icon: 'success',
            allowOutsideClick: false,
            showCancelButton: false,
            allowEscapeKey: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#3085d6',
            confirmButtonText: vy_lvst_lang.take_me_to_the_feed,
            didOpen: function() {
                self.playSound('openpopup');
            }
        }).then((result) => {
            if (result.isConfirmed) {

                self.gotohome(10, self.post_to_timeline == 'yes' ? 1 : 0);

            }



        });


        setTimeout(function() {

            self.gotohome(10, self.post_to_timeline == 'yes' ? 1 : 0);

        }, 2500);



        self.removeLiveFrontEnd();

    },
    stopLive: async function(window_unload) {
        const self = this;
        let data = {};


        if (self.obs_stream && self.current_min < 1 && self.post_to_timeline == 'yes' && vy_lv_recording && window_unload) {

            return self.removeShortVideos();
        }

        if (self.obs_stream) {
            return self.stopObsfirst();

        }


        if (self.current_min < 1 && self.post_to_timeline == 'yes' && vy_lv_recording && window_unload) {

            return self.removeShortVideos();

        }

        self.live_stopped = 1;
        self.socket_end_broadcast();
        data['cmd'] = 'stoplive';
        data['post_id'] = self.live_id;
        data['broadcast_id'] = self.broadcast_id;
        data['time'] = self.current_sec;
        data['post_to_timeline'] = self.post_to_timeline;
        data['filename'] = self.filename;
        data['file_type'] = self.file_type;



        if ('sendBeacon' in navigator) {

            await navigator.sendBeacon(this.ajax_url, self.toFormData(data));
            self.stopLiveAfterAjax();
        } else {

            await this.jajax(this.ajax_url, 'post', data).done(function(data) {
 
                if (data == 1) {
                    self.stopLiveAfterAjax();
                }

            });
        }

        self.is_live = 1;
        self.destroy_timer();
        self.stopTracks();

        if (vy_lv_recording && self.post_to_timeline == "yes") {

            if (vy_lv_rec_type == 'mp4')
                self.socket.emit("recording_convert", vy_lvst_uid, self.filename, data['post_id']);
            self._disconnect();
            self.fileName = null;
        }

        self.socket.close();
        self._disconnect();
        vy_lvst.k_stop();
        /*  if(vy_lv_recording) {
          
          // save record

             self.recordAudio.stopRecording( function() {
 
                 self.recordVideo.stopRecording( function() {

                     self.localStream.getTracks().forEach( track => track.stop() ); // stop each of them
                     self.PostBlob(self.recordAudio.getBlob(), self.recordVideo.getBlob(), self.generateFilename(), self.last_live_id);
                    
                });
            });
            
            }*/



    },
    unbindEvents: function() {

        __j(window).off("unload.vy-livestop beforeunload.vy_lv_confirm_exit beforeunload.vy-livestop");

        __j([document, window]).off("visibilitychange.vy_live_away");



    },
    generateFilename: function() {
        const d = new Date;
        return [(d.getFullYear()).padLeft(),
            parseInt(d.getMonth().padLeft()) + 1,
            d.getDate()
        ].join('-') + '-' + [d.getHours().padLeft(),
            d.getMinutes().padLeft(),
            d.getSeconds().padLeft()
        ].join('-');

    },
    validateJson: function(str, no_err) {
        try {
            var json = JSON.parse(str);

            if (typeof json.hasOwnProperty('status'))
                if (json.status === 'require_login')
                    window.location.reload();


            return json;
        } catch (e) {
            if (!no_err) {



            }
            return false;
        }
    },
    _getState: function() {
        this.original_state = window.location.pathname;
    },
    _replaceState: function(u) {

        this._getState();
        window.history.replaceState({}, document.title, u);

    },
    _originalState: function() {
        const self = this;
        window.history.replaceState({}, document.title, self.original_state);
    },
    exitFromStream: function(live_id) {

        this.destroy_timer();
        this._rthreedotsloading();
        this.clearVars();
        __j('#vy-livest').remove();
        this.showScroll();
        this._originalState();
        if (this.socket)
            this.socket.emit('exit_from_live', JSON.stringify({
                'live_id': escape(live_id),
                'user_id': escape(vy_lvst_user.i)
            }));
        vy_lvst.k_stop();
        this.destroy_flvplayer();
        this._disconnect();
        if (this.is_fullscreen)
            this.exitFullscreen();
    },
    hideScroll: function() {
        this.html.addClass('vy-lv-noscroll');

    },
    showScroll: function() {
        this.html.removeClass('vy-lv-noscroll');

    },

    replyToComment: function(el, evt, uid) {

        if (Swal.isVisible())
            Swal.close();

        this.evstop(evt);
        el = __j(el);

        const author_name = uid ? __j('.vy_lv_comm_uid_' + uid).find('.js__comment_author_name').val() : el.find('.js__comment_author_name').val();


        this.cnt.find('.js__inputfantom').trigger('click');
        this.cnt.find('#vy_lv_txtaddcomment_js').text('@' + author_name + ', ');

        let _Txt_area = this.cnt.find('#vy_lv_txtaddcomment_js');

        _Txt_area.focus();
        _Txt_area.get(0).setSelectionRange(_Txt_area.val().length, _Txt_area.val().length);

    },
    checkIfImModer: async function() {

        const self = this;
        self._loading();
        let data = {
            'moderator': false
        };
        await $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/checkifimmoder',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": escape(vy_lvst_uid),
                "Live_ID": escape(self.live_id)
            }),
            type: 'POST',
            success: function(d) {


                data = d;
                self._rLoading();
            },
            error: function(xhr, status, error) {
                self._rLoading();
                console.log('Error: ' + error.message);
                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);

            },
        });
        return data;

    },
    getLiveData: async function(Live_id, user_id,is_rtmp) {

        user_id = escape(user_id) || escape(vy_lvst_uid);
        const self = this;
        self._loading();
        let data = {
            'blocked': 'no',
            'muted': 'no'
        };
        await $.ajax({
            url: 'https://' + vy_lvst_socket_url + '/getliveoptions',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": user_id,
                "Live_ID": Live_id,
                "is_rtmp": is_rtmp
            }),
            type: 'POST',
            success: function(d) {


                data = d;
                self._rLoading();
            },
            error: function(xhr, status, error) {
                self._rLoading();
                console.log('Error: ' + error.message);
                self.showSwalErr(vy_lvst_lang.error + ': ' + error.message);

            },
        });
        return data;

    },
    beforeOpenLiveStream: async function(id,is_rtmp) {

        return this.getLiveData(id,vy_lvst_uid,is_rtmp);

    },
    MutedToast: function() {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'warning',
            title: vy_lvst_lang.you_are_muted_on_this_live
        });
    },
    showPostCommentBox: function(live_id) {
        __j('.js__vylivest_' + live_id).find('.js__vy-lv-comments-section').show();

    },
    hidePostCommentBox: function(live_id) {

        __j('.js__vylivest_' + live_id).find('.js__vy-lv-comments-section').hide();
    },
    openLiveStream: async function(evt, el, id) {
        const self = this;
        self.evstop(evt, 1);


        // prevent multiple clicks
        if (self.lastClick >= (Date.now() - self.lastclick_delay))
            return;

        el = __j(el);
        let d = new Array(),
            _timer = {
                'time': {}
            };
        self.live_id = id;
        self._loading();
        await this.jajax(this.ajax_url, 'post', {
            'cmd': 'join_live',
            'id': escape(id)
        }).done(function(r) {  

 
            d = self.validateJson(r);

            self._rLoading();

        });
 


        if (d.error && d.error_code == 404) {
            self.playSound('openpopup');
            return Swal.fire(
                vy_lvst_lang.not_found,
                vy_lvst_lang.the_broadcast_you_try_to_watch_not_found + '.',
                'warning'
            );

        }

        if (d.post['islivenow'] == 'yes') {
 
            const live_data = await self.beforeOpenLiveStream(id,d.post['obs']);
            _timer = live_data.time;

            if (live_data.blocked == 'yes') {

                self.playSound('openpopup');
                return Swal.fire(
                    vy_lvst_lang.blocked,
                    vy_lvst_lang.you_have_been_blocked_for_this_stream + '.',
                    'warning'
                );

            } else if (live_data.muted == 'yes') {
                self.im_muted = 1;
                self.MutedToast();
                setTimeout(function() {
                    self.hidePostCommentBox(id);
                }, 1100);
            } else if (live_data.terminated) {
                self.jajax(this.ajax_url, 'post', {
                    'cmd': 'delete-crashed',
                    'id': id
                });
                self.playSound('openpopup');
                return Swal.fire(
                    vy_lvst_lang.not_found,
                    vy_lvst_lang.the_broadcast_you_try_to_watch_not_found + '.',
                    'warning'
                );
            } else if (live_data.reconnecting == 0) {
            setTimeout(function(){
                self.wait_broadcast(id, 'network_error');
            },250);
            }

 
            if (live_data.moderator)
                self.im_moderator = 1;
        }

        if (!self.body.find('#vy-livest').length) {
            self.liveHeartBeat(id);
            self._replaceState("/watchstream");
            self.hideScroll();
            self.body.prepend(d.html);

            self.cnt = self.body.find('#vy-livest');


            if (d.post['islivenow'] == 'yes') {
                // self.checkNetworkStatus();
                self.scrollComments(self.cnt.find('#vy_lv_comments_section'), 1);

                // add slider for reactions for mobile devices
                if (self._is_smartphone()) {
                    self.cnt.find('.js__vy-lv-comments-section').addClass('__slider');
                    self.__onmobiles();
                    self.__onmobiles_watching();
                    //self.showTapForFullScreen();
                }

                self.addReactions(id);

                self.start_timer(_timer);


                const _socket = self._connect();

                setTimeout(function() {
                    if (d.post['obs'] == 'yes')
                        self.joinToLiveOBS(d.post);
                    else
                        self.joinToLive(id);


                    self.socket.emit('join_to_live', JSON.stringify({
                        'live_id': escape(id),
                        'user_id': escape(vy_lvst_user.i),
                        'user': vy_lvst_user
                    }));
                }, 500);
            } else {
                self.cnt.addClass('__ended');
            }

        }



    },
    addReactions: function(post_id) {

        let reactions = '',
            size = "_64";

        //if(this._is_smartphone())
        //size = "_32";

        for (var i = 0; i < vy_lv_reactions.length; i++)
            reactions += '<a href="javascript:void(0);" data-post-id="' + post_id + '" data-reaction-lang="' + vy_lv_reactions[i]['name'] + '" data-reaction-id="' + vy_lv_reactions[i]['id'] + '" data-reaction="' + vy_lv_reactions[i]['name'] + '" onclick="vy_lvst.sendReaction(this,event);" class="vy_lv_reaction ' + size + ' ' + vy_lv_reactions[i]['class'] + '"><label>' + vy_lv_reactions[i]['name'] + '</label></a>';

        this.cnt.find('.js__vy_lv_reactions_bt').html(reactions);

    },
    sendReaction: function(el, evt) {

        this.evstop(evt, 1);

        let _el = __j(el),
            _reaction_id = _el.data('reaction-id'),
            _post_id = _el.data('post-id'),
            content_icon = _el.attr('class'),
            reaction_icon = '<span class="' + content_icon.replace('_64', '_32') + '"></span>';

        this.socket.emit('send_reaction', JSON.stringify({
            'pointerX': evt.clientX,
            'pointerY': evt.clientY,
            'live_id': escape(_post_id),
            'sender': vy_lvst_user.i,
            'icon': reaction_icon
        }));


        if (!(sessionStorage.getItem("reacted_posts_" + vy_lvst_user.i) == _post_id + '-' + _reaction_id)) {
 
            this._sendReaction(_reaction_id,escape(_post_id));
            sessionStorage.setItem("reacted_posts_" + vy_lvst_user.i, _post_id + '-' + _reaction_id);
        }

    },
    _sendReaction:function(id,p_id){
 
        let reaction = 'like';

        switch(id){

        default:    
        case 1:
            reaction = 'like'
            break;
        case 2:  
            reaction='love';
            break;
        case 3:  
            reaction='haha';
            break;
        case 4:  
            reaction='wow';
            break;
        case 5:  
            reaction='sad';
            break;
        case 6:  
            reaction='angry';
            break;

        }
 
 
      $.post(api['posts/reaction'], { 'do': 'react_post', 'reaction': reaction, 'id': p_id }, function (response) {  
 
 
        if (response.callback) {
          eval(response.callback);
        } 
      }, 'json')
        .fail(function () {
          modal('#modal-message', { title: __['Error'], message: __['There is something that went wrong!'] });
        }); 


    },
    joinToLiveOBS: async function(rows) {

        const self = this;
        const j_video = __j('#vy_lv_livestream');
        const video = j_video[0];


        if (flvjs.isSupported() && !self.isIosSafari()) {
            this.flvPlayer
            this.flvPlayer = flvjs.createPlayer({
                "type": "flv",
                "url": vy_lvst_rtmp_url + vy_lvst_rtmp_app_name + rows['stream_name'] + '.flv',
                "isLive": true

            });
            this.flvPlayer.attachMediaElement(video);
            this.flvPlayer.load();
            this.flvPlayer.play();

            video.muted = false;

        } else {

            self._loading();
            this.jajax(self.ajax_url, 'post', {
                'cmd': 'get_rtmp_hls_path',
                'id': rows['user_id']
            }).done(function(path) {
                self._rLoading();
                j_video.attr('src', path);
                j_video[0].muted = false;
            });



        }

        self.unJoinOnUnload(rows.post_id);

 
    },
    joinToLive: async function(post_id, reconnect) {

        const self = this;
        const _socket = self.socket;
        this.video = __j('#vy_lv_livestream');
 
        if (Object.keys(this.config).length <= 0) {

            await this.getTurnCredentials();

        }
        if (reconnect)
            vy_lvst.webRtcPeer = null;

        vy_lvst._wss_connect(post_id, vy_lvst.viewer, (Math.floor(Math.random() * 99)));
        self.unJoinOnUnload(post_id);

        vy_lvst.play_muted_video(vy_lvst.video,1);

    },
    play_muted_video: function(v,m){

        setTimeout(function(){
            if(m) v.get(0).muted = false;
            v.get(0).play();
        },500);

    },
    unJoinOnUnload: function(post_id) {
        const self = this;
        __j(window).on('unload.vy_livestop_join beforeunload.vy_livestop_join', function(e) {

            self.exitFromStream(post_id);

            self.socket.close();
            self._disconnect();
        });

    },

    start_timer: function(t) {

        const self = this;
        const timer_opts = t ? {
            precision: 'seconds',
            startValues: {
                secondTenths: 7,
                seconds: t.s,
                minutes: t.m,
                hours: t.h,
                days: t.d
            }
        } : {
            precision: 'seconds'
        };
        let daysLabel, hoursLabel, minutesLabel, secondsLabel, totalSeconds = 0;


        this.easy_timer = new easytimer.Timer(timer_opts);

        this.easy_timer.start({
            callback: function(_timer) {
                self.current_min = _timer.getTimeValues().toString(['minutes']);

            }
        });

        this.easy_timer.addEventListener('secondsUpdated', function(e) {
            const _time = self.easy_timer.getTimeValues();

            daysLabel = _time.days;
            hoursLabel = _time.hours;
            minutesLabel = _time.minutes;
            secondsLabel = _time.seconds;


            if (daysLabel <= 0)
                daysLabel = '';
            if (hoursLabel <= 0)
                hoursLabel = '';
            if (minutesLabel < 10)
                minutesLabel = "0" + minutesLabel;
            if (secondsLabel < 10)
                secondsLabel = "0" + secondsLabel;

            hoursLabel = (daysLabel > 0 ? ":" : "") + hoursLabel;
            minutesLabel = (hoursLabel > 0 ? ":" : "") + minutesLabel;

            self.current_sec += 1;

            __j('.js__vy_lv_timer,.js__vy_lv_dsh_tm').text(daysLabel + hoursLabel + minutesLabel + ':' + secondsLabel);
        });


    },
    reload_timer: function() {
        if (this.easy_timer)
            this.easy_timer.start();

        this.timer_stopped = false;
    },
    pause_timer: function() {

        if (this.easy_timer)
            this.easy_timer.pause();

        this.timer_stopped = true;
    },
    stop_timer: function() {
        if (this.easy_timer)
            this.easy_timer.stop();

        this.timer_stopped = true;
    },
    destroy_timer: function() {

        if (this.easy_timer) {
            this.stop_timer();
            this.easy_timer.reset();

        }

        this.timer_stopped = true;
    },
    checkNetworkStatus: function() {


        const self = this;

        const handleNetworkChange = function(event) {
            if (!navigator.onLine) {
                self.pause_timer();
            } else if (navigator.onLine && self.timer_stopped) {
                self.reload_timer();

            }
        }

        window.addEventListener("online", handleNetworkChange);
        window.addEventListener("offline", handleNetworkChange);

    },
    gotohome: function(timeout, no_lend) {

        window.location = self.post_to_timeline == "yes" || !no_lend ? '/?lend' : '/';
    },
    PostBlob: function(audioBlob, videoBlob, fileName, live_id) {
        const self = this;

        self._rLoading();

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 6000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: vy_lvst_lang.we_process_your_stream
        });

        let formData = new FormData();
        formData.append('cmd', 'record');
        formData.append('filename', fileName);
        formData.append('audio-blob', audioBlob);
        formData.append('video-blob', videoBlob);
        formData.append('live_id', escape(live_id));
        this.saveBlob(self.ajax_url, formData, function(ffmpeg_output) {
            console.log(ffmpeg_output.replace(/\\n/g, '<br />'));

        });
    },
    saveBlob: function(url, data, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            }
        };
        request.open('POST', url);
        request.send(data);
    }

});