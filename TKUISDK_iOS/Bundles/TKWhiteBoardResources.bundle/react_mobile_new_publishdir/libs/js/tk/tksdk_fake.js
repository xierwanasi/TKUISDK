/*global L*/
'use strict';
/*
 * Class EventDispatcher provides event handling to sub-classes.
 * It is inherited from Publisher, Room, etc.
 */
var TK = TK || {};
// var TkGlobal = window.GLOBAL;
TK.EventDispatcher = function (spec) {
    var that = {};
    var isArray = function (object){
        return  object && typeof object==='object' &&
            typeof object.length==='number' &&
            typeof object.splice==='function' &&
            //判断length属性是否是可枚举的 对于数组 将得到false
            !(object.propertyIsEnumerable('length'));
    }
    // Private vars
    spec.dispatcher = {};
    spec.dispatcher.eventListeners = {};
    spec.dispatcher.backupListerners = {};
    // Public functions

    // It adds an event listener attached to an event type.
    that.addEventListener = function (eventType, listener , backupid ) {
        if(eventType === undefined || eventType === null){
            return;
        }
        if (spec.dispatcher.eventListeners[eventType] === undefined) {
            spec.dispatcher.eventListeners[eventType] = [];
        }
        spec.dispatcher.eventListeners[eventType].push(listener);
        if(backupid){
            if (spec.dispatcher.backupListerners[backupid] === undefined) {
                spec.dispatcher.backupListerners[backupid] = [];
            }
            spec.dispatcher.backupListerners[backupid].push({eventType:eventType ,listener:listener });
        }
    };

    // It removes an available event listener.
    that.removeEventListener = function (eventType, listener) {
        var index;
		if(!spec.dispatcher.eventListeners[eventType]){ L.Logger.info('[tk-fake-sdk]not event type: ' +eventType);  return ;} ;
        index = spec.dispatcher.eventListeners[eventType].indexOf(listener);
        if (index !== -1) {
            spec.dispatcher.eventListeners[eventType].splice(index, 1);
        }
    };
	
    // It removes all event listener.
    that.removeAllEventListener = function (eventTypeArr) {
        if( isArray(eventTypeArr) ){
            for(var i in eventTypeArr){
                var eventType = eventTypeArr[i] ;
                delete spec.dispatcher.eventListeners[eventType] ;
            }
        }else if(typeof eventTypeArr === "string"){
			delete spec.dispatcher.eventListeners[eventTypeArr] ;  
		}else if(typeof eventTypeArr === "object"){
            for(var key in eventTypeArr){
                var eventType = key  , listener = eventTypeArr[key];
                that.removeEventListener(eventType , listener);
            }
		}		  
    };

    // It dispatch a new event to the event listeners, based on the type
    // of event. All events are intended to be TalkEvents.
    that.dispatchEvent = function (event , log ) {
        var listener;
        log = log!=undefined?log:true ;
        if(log){
            L.Logger.debug('[tk-fake-sdk]dispatchEvent , event type: ' + event.type);
        }
        if(!window.eventLists1) {
            window.eventLists1 = []
        }
        window.eventLists1.push(event.type)
        for (listener in spec.dispatcher.eventListeners[event.type]) {
            if (spec.dispatcher.eventListeners[event.type].hasOwnProperty(listener)) {
                spec.dispatcher.eventListeners[event.type][listener](event);
            }
        }
    };

    that.removeBackupListerner = function (backupid) {
        if(backupid){
            if( spec.dispatcher.backupListerners[backupid] ){
                for(var i=0; i<spec.dispatcher.backupListerners[backupid].length ; i++){
                    var backupListernerInfo = spec.dispatcher.backupListerners[backupid][i] ;
                    that.removeEventListener(backupListernerInfo.eventType , backupListernerInfo.listener);
                }
                spec.dispatcher.backupListerners[backupid].length = 0 ;
                delete spec.dispatcher.backupListerners[backupid] ;
            }
        }
    };

    return that;
};

// **** EVENTS ****

/*
 * Class TalkEvent represents a generic Event in the library.
 * It handles the type of event, that is important when adding
 * event listeners to EventDispatchers and dispatching new events.
 * A TalkEvent can be initialized this way:
 * var event = TalkEvent({type: "room-connected"});
 */
TK.TalkEvent = function (spec) {
    var that = {};

    // Event type. Examples are: 'room-connected', 'stream-added', etc.
    that.type = spec.type;

    return that;
};

/*
 * Class RoomEvent represents an Event that happens in a Room. It is a
 * TalkEvent.
 * It is usually initialized as:
 * var roomEvent = RoomEvent({type:"room-connected", streams:[stream1, stream2]});
 * Event types:
 * 'room-connected' - points out that the user has been successfully connected to the room.
 * 'room-disconnected' - shows that the user has been already disconnected.
 */
TK.RoomEvent = function (spec , extraSpec) {
    var that = TK.TalkEvent(spec);

    // A list with the streams that are published in the room.
    that.streams = spec.streams;
    that.message = spec.message;
    that.user = spec.user;
    if(extraSpec && typeof extraSpec === 'object'){
        for(var key in extraSpec){
            that[key] = extraSpec[key];
        }
    }
    return that;
};

/*
 * Class StreamEvent represents an event related to a stream. It is a TalkEvent.
 * It is usually initialized this way:
 * var streamEvent = StreamEvent({type:"stream-added", stream:stream1});
 * Event types:
 * 'stream-added' - indicates that there is a new stream available in the room.
 * 'stream-removed' - shows that a previous available stream has been removed from the room.
 */
TK.StreamEvent = function (spec , extraSpec) {
    var that = TK.TalkEvent(spec);

    // The stream related to this event.
    that.stream = spec.stream;
    that.message = spec.message;
    that.bandwidth = spec.bandwidth;
    that.attrs = spec.attrs ;
    if(extraSpec && typeof extraSpec === 'object'){
        for(var key in extraSpec){
            that[key] = extraSpec[key];
        }
    }
    return that;
};

/*
 * Class PublisherEvent represents an event related to a publisher. It is a TalkEvent.
 * It usually initializes as:
 * var publisherEvent = PublisherEvent({})
 * Event types:
 * 'access-accepted' - indicates that the user has accepted to share his camera and microphone
 */
TK.PublisherEvent = function (spec , extraSpec) {
    var that = TK.TalkEvent(spec);
    if(extraSpec && typeof extraSpec === 'object'){
        for(var key in extraSpec){
            that[key] = extraSpec[key];
        }
    }
    return that;
};
TK.clientSdkEventManager = TK.EventDispatcher({});
TK.clientUICoreEventManager = TK.EventDispatcher({});
TK.mobileSdkEventManager = TK.EventDispatcher({});
TK.mobileUICoreEventManager = TK.EventDispatcher({});var TK = TK || {};
TK.SDKTYPE = undefined ;
TK.isOnlyAudioRoom = false ; //是否是纯音频教室
TK.extendSendInterfaceName = "" ;   //""（默认） , _videoWhiteboardPage(视频标注)
TK.SDKNATIVENAME = undefined ;
TK.global = {
    fakeJsSdkInitInfo:{
        debugLog:false, //客户端控制是否打印debug日志
        playback:false , //是否是回放
        deviceType:undefined ,  //phone , pad  , windowClient , macClient
        mobileInfo:{
            isSendLogMessageToProtogenesis:false, //是否发送日志信息给原生移动端
            clientType:undefined , //android , ios
        }
    },
};

TK.QtNativeClientRoom = function (roomOptions) {
    TK.SDKNATIVENAME = 'QtNativeClientRoom' ;
    TK.SDKTYPE = 'pc' ;
    return TK.Room(roomOptions);
};
TK.MobileNativeRoom = function (roomOptions) {
    TK.SDKNATIVENAME = 'MobileNativeRoom' ;
    TK.SDKTYPE = 'mobile' ;
    return TK.Room(roomOptions);
};
TK.Room = function (roomOptions) {
    'use strict';
    if(!TK.SDKNATIVENAME){
        L.Logger.error('[tk-fake-sdk]Room is not init!');
        return ;
    }
    roomOptions = roomOptions || {} ;

    // TK.SDKVERSIONS =  window.__SDKVERSIONS__  || "2.1.8";
    TK.SDKVERSIONS =  "2.2.1";
    // TK.SDKVERSIONSTIME =  window.__SDKVERSIONSTIME__  || "2018032915";
    TK.SDKVERSIONSTIME =  "2018082114";

    L.Logger.info('[tk-sdk-version]sdk-version:'+ TK.SDKVERSIONS +' , sdk-time: '+ TK.SDKVERSIONSTIME) ;

    var spec={};
    var that = TK.EventDispatcher(spec);

    var ERR_HTTP_REQUEST_FAILED = 3;

    var _myself = {}  , _users = {}   , _room_properties = {} , _isPlayback = false  ,
        _rolelist = {} , _fistSetLog = false , _room_name = undefined , _room_type = undefined ,
        _is_room_live = false , _room_max_videocount = undefined  , _room_id = undefined  ,
        _web_protocol = undefined, _web_host = undefined , _web_port = undefined ,
        _doc_protocol = undefined ,_doc_host = undefined ,  _doc_port = undefined   ,
        _backup_doc_protocol = undefined ,_backup_doc_host = undefined ,  _backup_doc_port = undefined   ,
        _whiteboardManagerInstance = undefined ,socketBindListMap ={},_backup_doc_host_list=[];
    var _roomMode = window.TK.ROOM_MODE.NORMAL_ROOM ; //房间模式，默认window.TK.ROOM_MODE.NORMAL_ROOM

    that.socket = TK.fakeScoketIO(that);

    /*设置日志是否是debug级别
     * @params isDebug:是否是debug日志 ， 默认false , Boolean
     * @params logLevel:指定日志级别【
         0, //debug 级别日志
         1, //trace 级别日志
         2, //info 级别日志
         3, //warning 级别日志
         4, //error 级别日志
         5 //不打印日志
     】， 默认跟着isDebug(如果是debug则logLevel=0 , 否则logLevel=2) , Number*/
    that.setLogIsDebug = function (isDebug , logLevel) {
        isDebug = isDebug || false ;
        if(logLevel !== undefined ){
            if(logLevel === 0){
                isDebug = true ;
            }else{
                isDebug = false ;
            }
        }
        var socketLogConfig = {
            debug:isDebug ,
        } , loggerConfig = {
            development:isDebug ,
            logLevel:logLevel !== undefined && typeof logLevel === 'number' ? logLevel :(isDebug ? L.Constant.LOGLEVEL.DEBUG :  L.Constant.LOGLEVEL.INFO) ,
        }, adpConfig = {
            webrtcLogDebug:isDebug
        };
        TK.tkLogPrintConfig( socketLogConfig , loggerConfig , adpConfig );
    };

    /*获取房间属性信息*/
    that.getRoomProperties = function() {
        return _room_properties;
    };

    /*获取所有的用户信息*/
    that.getUsers = function () {
        return _users ;
    };

    /*获取用户
     * @params id:用户id , String */
    that.getUser=function(id) {
        if(id === undefined)
            return undefined;

        return _users[id];
    };

    /*获取我自己的用户信息*/
    that.getMySelf=function() {
        return _myself;
    };

    /*改变接口的扩展名字
    * @params extendSendInterfaceName:扩展名字*/
    that.changeExtendSendInterfaceName = function (extendSendInterfaceName) {
        TK.extendSendInterfaceName = extendSendInterfaceName ;
    };

    /*开始共享媒体文件
    * @params url:共享的地址 ， String
    * @params isVideo:是否有video ， 默认false ， Boolean
    * @params toID:发送给谁 , 缺省发给所有人 ， String
    * @params attrs:流携带的attributes数据， Json
    * */
    that.startShareMedia = function (url , isVideo , toID ,attrs) {
        if(!url){
            L.Logger.error('[tk-fake-sdk]startShareMedia url can not be empty!');
            return;
        }
        var attributes = {type:'media'};
        isVideo = isVideo !==undefined ? isVideo : false ;
        if(toID !== undefined){
            attributes.toID = toID ;
        }
        if(attrs && typeof attrs === 'object'){
            for(var key in attrs){
                if(key !== 'toID' && key !== 'type'){
                    attributes[key] = attrs[key] ;
                }
            }
        }
        var startShareMediaJson = {audio:true , video:isVideo , url:url , attributes:attributes };
        _sendMessageSocket('publishNetworkMedia' , startShareMediaJson);
    };

    /*停止共享媒体文件 */
    that.stopShareMedia = function () {
        _sendMessageSocket('unpublishNetworkMedia');
    };

    /*页面加载完毕，给伪代理服务器通知页面加载完毕*/
    that.onPageFinished = function () {
        _sendMessageSocket('onPageFinished');
    };

    /*通知ios播放MP3*/
    that.isPlayAudio = function (url , isPlay , attrs) {
        var audioJson = {audio:true , video: attrs.type === 'video',  isPlay:isPlay , url:url, type:attrs.type, fileid: attrs.fileid, attributes:attrs };
        _sendMessageSocket('isPlayAudio' , audioJson);
    };

    /*通知ios播放MP4*/
    that.isPlayVideo = function (url , isPlay , attrs) {
        var videoJson = {video:true , isPlay:isPlay , url:url , type:attrs.type , other: attrs.other};
        _sendMessageSocket('isPlayVideo' , videoJson);
    };

    /*发送PubMsg信令功能函数
     * @allParams params:pubMsg需要的所有参数承接对象
     * @params name:信令名字 , String
     * @params id:信令ID , String
     * @params toID:发送给谁(默认发给所有人) , String
                 __all（所有人，包括自己） ,
                 __allExceptSender （除了自己以外的所有人）,
                 userid（指定id发给某人） ,
                 __none （谁也不发，只有服务器会收到）,
                 __allSuperUsers（只发给助教和老师）,
                 __group:groupA:groupB(发送给指定组，组id不能包含冒号),
                 __groupExceptSender:groupA（发给指定组，不包括自己）
     * @params data:信令携带的数据 , Json/JsonString
     * @params save:信令是否保存 , Boolean
     * @params associatedMsgID:绑定的父级信令id , String
     * @params associatedUserID:绑定的用户id , String
     * @params expiresabs:暂时不用
     * @params expires:暂时无效
     * @params type:扩展类型，目前只有count一种扩展类型，之后如需扩展可在此处进行相应变动 , String (目前直播才有用)
     * @params write2DB:暂时无效, Boolean (目前直播才有用)
     * @params actions:执行的动作操作列表，目前只有0，1 (0-不操作，1-代表增加操作), Array (目前直播才有用)
     * @params do_not_replace:老师和助教不能同时操作，后操作的服务器直接丢弃, Boolean (目前直播才有用)
     * */
    that.pubMsg=function(params) {
        if(typeof params !== 'object'){
            L.Logger.error('[tk-sdk]pubMsg params must is json!');
            return ;
        }
        var _params = {};
        _params.name =  params['name'] ||  params['msgName'] ;
        _params.id = params['id'] || params['msgId'] || _params.name;
        _params.toID = params['toID'] || params['toId'] || '__all'; //  toID=> __all , __allExceptSender , userid , __none ,__allSuperUsers
        _params.data= params['data'] ;
        if(!params['save']){
            _params.do_not_save="";
        }
        if(params['associatedMsgID'] !== undefined){
            _params.associatedMsgID = params['associatedMsgID'] ;
        }
        if(params['associatedUserID'] !== undefined){
            _params.associatedUserID = params['associatedUserID'] ;
        }
        var expandParams = {};
        /*
         * @params expiresabs:暂时不用
         * @params expires:暂时无效
         * @params type:扩展类型，目前只有count一种扩展类型，之后如需扩展可在此处进行相应变动 , String (目前直播才有用)
         * @params write2DB:暂时无效, Boolean (目前直播才有用)
         * @params actions:执行的动作操作列表，目前只有0，1 (0-不操作，1-代表增加操作), Array (目前直播才有用)
         * @params do_not_replace:老师和助教不能同时操作，后操作的服务器直接丢弃, Boolean (目前直播才有用)
         * */
        for(var key in params){
            if(_params[key] === undefined && params[key] !== undefined && key !== 'save' && key !== 'name' && key !== 'msgName' && key !== 'id' && key !== 'msgId'
                && key !== 'toID' && key !== 'toId' && key !== 'data' && key !== 'associatedMsgID' && key !== 'associatedUserID'){
                expandParams[key] =  params[key];
                // _params[key] = params[key];
            }
        }
        _params.expandParams = expandParams;
        _sendMessageSocket('pubMsg',_params);
    };

    /*发送DelMsg信令功能函数,删除之前发送的信令
     * @allParams params:delMsg需要的所有参数承接对象
     * @params name:信令名字 , String
     * @params id:信令ID , String
     * @params toID:发送给谁(默认发给所有人) , String
             __all（所有人，包括自己） ,
             __allExceptSender （除了自己以外的所有人）,
             userid（指定id发给某人） ,
             __none （谁也不发，只有服务器会收到）,
             __allSuperUsers（只发给助教和老师）,
             __group:groupA:groupB(发送给指定组，组id不能包含冒号),
             __groupExceptSender:groupA（发给指定组，不包括自己）
     * @params data:信令携带的数据 , Json/JsonString
     * */
    that.delMsg=function(params) {
        var name, id, toID, data ;
        if(arguments.length === 1 && params && typeof params === 'object'){
            name =  params['name'] || params['msgName'];
            id = params['id'] || params['msgId'];
            toID =   params['toID'] || params['toId'];
            data =  params['data'];
        }else{
            name =  arguments[0];
            id = arguments[1];
            toID =  arguments[2];
            data =  arguments[3];
        }
        var _params = {};
        _params.name=name;
        _params.id=id || _params.name;
        _params.toID=toID || '__all';
        _params.data=data;
        if(_params.name === undefined || _params.name  === null){
            L.Logger.error('[tk-fake-sdk]delMsg name is must exist!');
            return ;
        }
        if(_params.id === undefined || _params.id  === null){
            L.Logger.error('[tk-fake-sdk]delMsg id is must exist!');
            return ;
        }
        _sendMessageSocket('delMsg',_params);
    };

    /*改变用户属性
     * @params id:用户id , String
     * @params tellWhom:发送给谁( __all , __allExceptSender , userid , __none ,__allSuperUsers) , String
     * @params properties:需要改变的用户属性 , Json*/
    that.changeUserProperty=function(id, tellWhom, properties) {
        if ( TK.isOnlyAudioRoom && properties.publishstate !== undefined && (properties.publishstate === TK.PUBLISH_STATE_VIDEOONLY || properties.publishstate === TK.PUBLISH_STATE_BOTH) ) {
            L.Logger.warning('[tk-fake-sdk]The publishstate of a pure audio room cannot be ' + properties.publishstate + '!');
            return;
        }

        if (properties === undefined || id === undefined){
            L.Logger.error('[tk-fake-sdk]changeUserProperty properties or id is not exist!');
            return  ;
        }
        var params = {};
        params.id = id;
        params.toID = tellWhom || '__all';
        var user = _users[id] ;
        if(!user){L.Logger.error('[tk-fake-sdk]user is not exist , user id: '+id+'!'); return ;} ;
        if( !(properties && typeof properties === 'object') ){L.Logger.error('[tk-fake-sdk]properties must be json , user id: '+id+'!'); return ;} ;
        params.properties = properties;
        _sendMessageSocket('setProperty',params);
    };

    /*通知伪代理服务器改变窗口的全屏状态*/
    that.changeWebPageFullScreen = function (isFullScreen) {
        _sendMessageSocket('changeWebPageFullScreen',{fullScreen:isFullScreen});
    };

    /*离开房间
    * @params force:是否强制离开*/
    that.leaveroom = function (force) {
        force = force || false ;
        _sendMessageSocket('leaveroom',{force:force});
    };

    /*发送聊天信息功能函数
     * @params textMessage:发送的聊天消息文本 ,String
     * @params toID:发送给谁 , String
     * @params extendJson:扩展的发送的聊天消息数据 , Json
     * */
    that.sendMessage=function(textMessage, toID , extendJson) {
        var params={};
        toID =  toID || "__all" ;
        params.toID = toID;
        var message = {};
        if(typeof textMessage === 'string'){
            var textMessageCopy = L.Utils.toJsonParse(textMessage);
            if(typeof textMessageCopy !== 'object'){
                textMessageCopy = textMessage;
            }
            textMessage = textMessageCopy;
        }
        if(typeof textMessage === 'object'){ //这里兼容以前的处理，如果textMessage是json则拷贝到message里面
            for(var key in textMessage){
                message[key] = textMessage[key] ;
            }
        }else{
            message.msg = textMessage ;
        }
        if(typeof extendJson === 'string'){
            extendJson = L.Utils.toJsonParse(extendJson);
        }
        if( extendJson && typeof extendJson === 'object'){
            for(var key in extendJson){
                message[key] = extendJson[key] ;
            }
        }
        params.message =  L.Utils.toJsonStringify(message); //这里必须转为json字符串
        _sendMessageSocket('sendMessage',params);
    };

    /*发送给伪服务器的action相关的cmd指令
     * @params action:执行的动作 , String
     * @params cmd:执行动作的cmd描述 ， Json */
    that.sendActionCommand = function (action , cmd) {
        if(!action){
            L.Logger.warning('[tk-fake-sdk]sendActionCommand method action can not be empty!');
            return;
        }
        _sendMessageSocket('sendActionCommand',{ action:action , cmd:cmd });
    };

    that.setLocalStorageItem = function( key , value ){
        _sendMessageSocket('saveValueByKey',{ key:''+key , value:''+value });
    };

    that.getLocalStorageItem = function ( key , callback ) {
        var _callback = undefined ;
        if( typeof callback === 'function' ){
            _callback = function ( value ) {
				if(value === null || value === undefined || value === 'null' || value === 'undefined'){
					value = '';
				}
                callback( ''+value );
            };
        }
        _sendMessageSocket('getValueByKey',{ key:''+key  } , _callback );
    };

    /*退出视频标注
     * @params state:"media"：表示共享的是服务器的媒体文件 ，  "file"：表示共享的是本地的媒体文件，String
     * */
    that.exitAnnotation = function(state){
        if(typeof state !== "string"){
            L.Logger.error('[tk-fake-sdk]state is not a string');
            return ;
        }
        _sendMessageSocket('exitAnnotation' , state);
    };

    /*注册白板管理器的托管服务
     * @params <WhiteboardManagerInstance>whiteboardManagerInstance 白板管理器
     * */
    that.registerRoomWhiteBoardDelegate = function(  whiteboardManagerInstance ){
        if( whiteboardManagerInstance && whiteboardManagerInstance.className === 'TKWhiteBoardManager' && typeof whiteboardManagerInstance.registerRoomDelegate === 'function' ){
            _whiteboardManagerInstance = whiteboardManagerInstance ;
            if( _whiteboardManagerInstance ){
                if(  _whiteboardManagerInstance.registerRoomDelegate ){
                    var _receiveActionCommand = function( action , cmd ){
                        //action:whiteboardSdkNotice_ShowPage(翻页消息通知给sdk)
                        L.Logger.debug( '[tk-sdk]receive whiteboard sdk action command（action,cmd）:' , action , cmd );
                        that.sendActionCommand(action , cmd);
                    };
                    _whiteboardManagerInstance.registerRoomDelegate( that , _receiveActionCommand );
                    // _whiteboardManagerInstance.registerRoomDelegate( that );
                }
                if( _whiteboardManagerInstance.changeCommonWhiteBoardConfigration ){
                    var updateeCommonWhiteBoardConfigration = {};
                    if( _web_protocol && _web_host && _web_port !== undefined ){
                        updateeCommonWhiteBoardConfigration.webAddress = {
                            protocol:_web_protocol,
                            hostname:_web_host,
                            port: _web_port,
                        }; //php服务器地址
                    }
                    if( _doc_protocol && _doc_host && _doc_port !== undefined ){
                        updateeCommonWhiteBoardConfigration.webAddress = {
                            protocol:_doc_protocol,
                            hostname:_doc_host,
                            port: _doc_port,
                        }; //文档服务器地址
                    }
                    if(_backup_doc_host_list.length){
                        var backupDocAddressList = [];
                        for(var i=0,length=_backup_doc_host_list.length;i<length;i++){
                            backupDocAddressList.push({
                                protocol:_backup_doc_protocol,
                                hostname:_backup_doc_host_list[i],
                                port: _backup_doc_port,
                            });
                        }
                        updateeCommonWhiteBoardConfigration.backupDocAddressList = backupDocAddressList;
                    }
                    if( _myself.id !== undefined ){
                        updateeCommonWhiteBoardConfigration.myUserId =  _myself.id  ; //我的userID
                    }
                    if( _myself.nickname !== undefined ){
                        updateeCommonWhiteBoardConfigration.myName =  _myself.nickname  ; //我的名字
                    }
                    if( _myself.role !== undefined ){
                        updateeCommonWhiteBoardConfigration.myRole =  _myself.role  ; //我的角色
                    }
                    updateeCommonWhiteBoardConfigration.isPlayback = _isPlayback  ; //是否是回放
                    updateeCommonWhiteBoardConfigration.deviceType = TK.global.fakeJsSdkInitInfo.deviceType; //phone , pad  , windowClient , macClient
                    updateeCommonWhiteBoardConfigration.clientType = TK.global.fakeJsSdkInitInfo.mobileInfo.clientType; //android , ios
                    _whiteboardManagerInstance.changeCommonWhiteBoardConfigration(updateeCommonWhiteBoardConfigration);
                }
            }
        }else{
            L.Logger.warning('[tk-sdk]register whiteboardManagerInstance not is a TKWhiteBoardManager instance class , cannot execute registerRoomWhiteBoardDelegate method.');
        }
    };

    /*事件绑定以及处理函数Map映射关系*/
    socketBindListMap = {
        'setProperty':function (messages) {
            L.Logger.debug('[tk-fake-sdk]setProperty info:' , L.Utils.toJsonStringify(messages) );
            var param = messages;
            var userid = param.id;
            if(param.hasOwnProperty("properties")){
                var properties =  param.properties;
                var user = _users[userid];
                if (_myself.id === userid ) {
                    user = _myself;
                }
                if (user === undefined){
                    L.Logger.error( '[tk-fake-sdk]setProperty user is not exist , userid is '+userid+'!'  );
                    return;
                }
                for (var key in properties) {
                    if (key !== 'id' && key !== 'watchStatus'){
                        user[key]=properties[key];
                    }
                }
                var roomEvt = TK.RoomEvent({type: 'room-userproperty-changed', user:user, message:properties} , { fromID:param.fromID} );
                that.dispatchEvent(roomEvt);
                if( _roomMode === window.TK.ROOM_MODE.BIG_ROOM ){
                    if(userid !== _myself.id && _users[userid].role !== window.TK.ROOM_ROLE.TEACHER && _users[userid].role !== window.TK.ROOM_ROLE.ASSISTANT){ //角色不是老师和助教且下台用户，则从列表中删除
                        if(_users[userid].publishstate === TK.PUBLISH_STATE_NONE){
                            delete  _users[userid] ;
                        }
                    }
                }
            }
        } ,
        'participantLeft':function (userid , leaveTs) {
            L.Logger.debug('[tk-fake-sdk]participantLeft userid:' + userid);
            var user = _users[userid];
            if (user === undefined){
                L.Logger.error( '[tk-fake-sdk]participantLeft user is not exist , userid is '+userid+'!'  );
                return;
            }
            L.Logger.info('[tk-fake-sdk]user leave room  , user info: '+L.Utils.toJsonStringify(user) );
            if( _isPlayback && leaveTs !== undefined){
                user.leaveTs = leaveTs ;
            }
            if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
            if(!_isPlayback){
                delete _rolelist[user.role][userid] ;
                delete _users[userid];
            }else{
                if(_users[userid]){
                    _users[userid].playbackLeaved = true ;
                }
            }
            if( _isPlayback && typeof userid === 'object' ){
                var userinfo = userid ;
                user.leaveTs = userinfo.ts ;
            }
            var roomEvt = TK.RoomEvent({type: 'room-participant_leave', user: user});
            that.dispatchEvent(roomEvt);
        } ,
        'participantJoined':function (userinfo) {
            L.Logger.debug('[tk-fake-sdk]participantJoined userinfo:'+ L.Utils.toJsonStringify(userinfo) );
            var user = TK.RoomUser(userinfo);
            L.Logger.info('[tk-fake-sdk]user join room  , user info: '+L.Utils.toJsonStringify(user) );
            /*if (user === undefined) {
                return;
             }*/
            if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
            _rolelist[user.role][user.id] = user ;
            _users[user.id]=user;
            if(_isPlayback && _users[user.id]){
                delete _users[user.id].playbackLeaved ;
            }
            if( _isPlayback && typeof userinfo === 'object'  ){
                user.joinTs = userinfo.ts ;
            }
            var roomEvt = TK.RoomEvent({type: 'room-participant_join', user: user});
            that.dispatchEvent(roomEvt);
        },
        'participantEvicted':function (messages) {
            messages = messages || {} ;
            L.Logger.info('[tk-fake-sdk]user evicted room  , user info: '+L.Utils.toJsonStringify(_myself) + ' , participantEvicted  messages:'+ L.Utils.toJsonStringify(messages) );
            // that.leaveroom(true);
            var roomEvt = TK.RoomEvent({type: 'room-participant_evicted' , message:messages , user:_myself});
            that.dispatchEvent(roomEvt);
        },
        'pubMsg':function (messages) {
            L.Logger.debug( '[tk-fake-sdk]pubMsg info:' ,  L.Utils.toJsonStringify(messages) );
            if(messages && typeof messages === 'string'){
                messages = L.Utils.toJsonParse(messages);
            }
            if(messages.data && typeof messages.data === 'string'){
                messages.data = L.Utils.toJsonParse(messages.data);
            }
            if (messages.name === 'OnlyAudioRoom') {
                _handleSwitchOnlyAudioRoom(true , messages.fromID);
            }
            if(messages.name === 'BigRoom'){
                _roomMode = window.TK.ROOM_MODE.BIG_ROOM ;
                _removeBigRoomUsers();
                var roomEvt = TK.RoomEvent({type: 'room-mode-changed', message:{
                    roomMode:_roomMode
                }});
                that.dispatchEvent(roomEvt);
            }
            var roomEvt = TK.RoomEvent({type: 'room-pubmsg', message:messages});
            that.dispatchEvent(roomEvt);
        },
        'delMsg':function (messages) {
            L.Logger.debug( '[tk-fake-sdk]delMsg info:' ,  L.Utils.toJsonStringify(messages) );
            if(messages && typeof messages === 'string'){
                messages = L.Utils.toJsonParse(messages);
            }
            if(messages.data && typeof messages.data === 'string'){
                messages.data = L.Utils.toJsonParse(messages.data);
            }
            if (messages.name === 'OnlyAudioRoom') {
                _handleSwitchOnlyAudioRoom(false , messages.fromID);
            }
            if(messages.name === 'BigRoom'){
                _roomMode = window.TK.ROOM_MODE.NORMAL_ROOM ;
                _removeBigRoomUsers();
                var roomEvt = TK.RoomEvent({type: 'room-mode-changed', message:{
                    roomMode:_roomMode
                }});
                that.dispatchEvent(roomEvt);
            }
            var roomEvt = TK.RoomEvent({type: 'room-delmsg', message:messages});
            that.dispatchEvent(roomEvt);
        } ,
        'sendMessage':function (messages) {
            L.Logger.debug('[tk-fake-sdk]room-text-message info:' + (messages && typeof messages === 'object' ? L.Utils.toJsonStringify(messages) : messages )) ;
            if (!( messages && messages.hasOwnProperty('message') ) ){  L.Logger.error('[tk-fake-sdk]room-text-message messages or messages.message is not exist!'); return;};
            var from = messages.fromID;
            var user = _myself;

            if(_room_properties.roomtype === 10){  //2017-11-13 xgd 是否是直播，是直播user为undefined
                user = undefined;
            } else {
                if (from !== undefined)
                    user = _users[messages.fromID];
                if(!user){L.Logger.error('[tk-fake-sdk]user is not exist , user id:'+messages.fromID+', message from room-text-message!');return ;};
            }
            if( _isPlayback){
                var isString = false ;
                if(messages && messages.message && typeof  messages.message  === 'string' ){
                    messages.message = L.Utils.toJsonParse(messages.message);
                    isString = true ;
                }
                messages.message.ts = messages.ts ; //ms
                if(isString && typeof messages.message === 'object'){
                    messages.message = L.Utils.toJsonStringify( messages.message );
                }
            }
            if(messages && messages.message && typeof  messages.message  === 'string' ){
                messages.message = L.Utils.toJsonParse(messages.message);
            }
            var roomEvt = TK.RoomEvent({type: 'room-text-message', user:user, message:messages.message});
            that.dispatchEvent(roomEvt);
        },
        'roomConnected':function (code, response) {
            L.Logger.debug('[tk-fake-sdk]room-connected code is '+ code +' , response is :'+ L.Utils.toJsonStringify(response) );
            if(code !== 0){
                L.Logger.error('[tk-fake-sdk]connectSocket failure , code is '+ code + ' , response is '+ response) ;
                return ;
            }
            var roominfo = response.roominfo;//房间信息
            var msglist = response.msglist; //各种消息列表，对应pugmsg所有信息
            var userlist = response.userlist;//用户列表，我进入教室后，服务器发送此房间列表给我

            var   roomId, arg;
            that.p2p = roominfo.p2p;
            roomId = roominfo.id;

            _users = {} ;
            _rolelist = {} ;
            if(response.myself && typeof response.myself === 'object'){
                _myself = TK.RoomUser(response.myself);
            }
            if(!_rolelist[_myself.role]) { _rolelist[_myself.role] = {} };
            _rolelist[_myself.role][_myself.id] = _myself ;
            _users[_myself.id]=_myself;

            for (var index in userlist) {
                if (userlist.hasOwnProperty(index)) {
                    var userproperties = userlist[index];
                    var user = TK.RoomUser(userproperties);
                    if (user !== undefined) {
                        if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
                        _rolelist[user.role][user.id] = user ;
                        _users[user.id]=user;
                        if(_isPlayback && _users[user.id]){
                            delete _users[user.id].playbackLeaved ;
                        }
                        L.Logger.info('[tk-fake-sdk]room-connected --> user info: '+L.Utils.toJsonStringify(user) );
                    }
                }
            }
            L.Logger.info('[tk-fake-sdk]room-connected --> myself info: '+L.Utils.toJsonStringify(_myself) );
            var msgs = new Array();
            if(msglist && typeof msglist == "string") {
                msglist = L.Utils.toJsonParse(msglist);
            }
            if (msglist.hasOwnProperty('OnlyAudioRoom')) {
                var messages = msglist['OnlyAudioRoom'];
                _handleSwitchOnlyAudioRoom(true ,  messages.fromID);
            }
            if(  msglist.hasOwnProperty('BigRoom') ){
                _roomMode = window.TK.ROOM_MODE.BIG_ROOM ;
                _removeBigRoomUsers();
            }else{
                _roomMode = window.TK.ROOM_MODE.NORMAL_ROOM ;
            }
            var roomEvt = TK.RoomEvent({type: 'room-mode-changed', message:{
                roomMode:_roomMode
            }});
            that.dispatchEvent(roomEvt);
            for (index in msglist) {
                if (msglist.hasOwnProperty(index)) {
                    msgs.push(msglist[index]);
                }
            }
            msgs.sort(function(obj1, obj2){
                if (obj1 === undefined || !obj1.hasOwnProperty('seq') || obj2 === undefined || !obj2.hasOwnProperty('seq'))
                    return 0;
                return obj1.seq - obj2.seq;
            });

            // 3 - Update RoomID
            that.roomID = roomId;
            console.error('[tk-fake-sdk]Connected to room ' + that.roomID);
            console.error('[tk-fake-sdk]connected response:' , L.Utils.toJsonStringify(response));
            console.error('[tk-fake-sdk]room-connected  signalling list length '+ msgs.length);
            response.userlist.length && response.userlist.forEach(item => {
                if(item) {
                    if(item.id === response.myself.id) {
                        TK.mySelf = item.properties;
                    }
                }
            })
            if( _whiteboardManagerInstance){
                if( _whiteboardManagerInstance.changeCommonWhiteBoardConfigration ){
                    var backupDocAddressList = [];
                    for(var i=0,length=_backup_doc_host_list.length;i<length;i++){
                        backupDocAddressList.push({
                            protocol:_backup_doc_protocol,
                            hostname:_backup_doc_host_list[i],
                            port: _backup_doc_port,
                        });
                    }
                    _whiteboardManagerInstance.changeCommonWhiteBoardConfigration({
                        webAddress:{
                            protocol:_web_protocol,
                            hostname:_web_host,
                            port: _web_port,
                        }  , //php服务器地址
                        docAddress:{
                            protocol:_doc_protocol,
                            hostname:_doc_host,
                            port: _doc_port,
                        }, //文档服务器地址
                        backupDocAddressList:backupDocAddressList , //备份文档服务器地址列表
                        myUserId: _myself.id , //我的userID
                        myName: _myself.nickname ,  //我的名字
                        myRole: _myself.role ,  //我的角色
                        isConnectedRoom:true , //是否已经连接房间
                        isPlayback:_isPlayback , //是否是回放
                        deviceType:TK.global.fakeJsSdkInitInfo.deviceType, //phone , pad  , windowClient , macClient
                        clientType:TK.global.fakeJsSdkInitInfo.mobileInfo.clientType, //android , ios
                    });
                }
            }
            var connectEvt = TK.RoomEvent({type: 'room-connected', streams: [], message:msgs});
            that.dispatchEvent(connectEvt);
            return true ;
        },
        'disconnect':function (messages) {
            L.Logger.debug('[tk-fake-sdk]room-disconnected' );
            _resetRoomState();
            if( _whiteboardManagerInstance ){
                if( _whiteboardManagerInstance.changeCommonWhiteBoardConfigration ){
                    _whiteboardManagerInstance.changeCommonWhiteBoardConfigration({
                        isConnectedRoom:false , //是否已经连接房间
                    });
                }
            }
            var disconnectEvt = TK.RoomEvent({type: 'room-disconnected' , message: messages || 'unexpected-disconnection' });
            that.dispatchEvent(disconnectEvt);
        },
        'reconnecting':function (reconnectingNum) {
            L.Logger.debug('[tk-fake-sdk]reconnecting info:' , reconnectingNum) ;
            var disconnectEvt = TK.RoomEvent({type: 'room-reconnecting',
                message: {number:reconnectingNum , info:'room-reconnecting number:'+ reconnectingNum }});
            that.dispatchEvent(disconnectEvt);
        },
        'reconnected':function (message) {
            var roomEvt = TK.RoomEvent({type: 'room-reconnected', message:message});
            that.dispatchEvent(roomEvt);
        },
        'leaveroom':function (message) {
            if( _whiteboardManagerInstance ){
                if( _whiteboardManagerInstance.changeCommonWhiteBoardConfigration ){
                    _whiteboardManagerInstance.changeCommonWhiteBoardConfigration({
                        isConnectedRoom:false , //是否已经连接房间
                    });
                }
            }
            var roomEvt = TK.RoomEvent({type: 'room-leaveroom', message:message});
            that.dispatchEvent(roomEvt);
        },
        'checkroom':function (response) {
            var userinfo = {};
            var nRet = response.result;
            var room;
            var pullInfo  ;
            if (nRet == 0) {
                room = response.room;
                pullInfo = response.pullinfo ;

                room.roomtype =  Number( room.roomtype ) ;
                room.maxvideo =  parseInt( room.maxvideo ) ;
                response.roomrole =  Number( response.roomrole ) ;
                var  pullConfigureJson = {};
                var pushConfigureJson = {} ;
                if(pullInfo && pullInfo.data && pullInfo.data.pullConfigureList){
                    var pullConfigureList = pullInfo.data.pullConfigureList ;
                    for(var i in pullConfigureList){
                        var pullConfigure = pullConfigureList[i] ;
                        pullConfigureJson[ pullConfigure.pullProtocol ] =  pullConfigure.pullUrlList ;
                    }
                }
                if(pullInfo && pullInfo.data && pullInfo.data.pushConfigureInfo){
                    var pushConfigureInfo = pullInfo.data.pushConfigureInfo ;
                    for(var i in pushConfigureInfo){
                        var pushConfigure = pushConfigureInfo[i] ;
                        pushConfigureJson[ pushConfigure.pushProtocol ] =  pushConfigure ;
                    }
                }
                room.pullConfigure = pullConfigureJson ;
                room.pushConfigure = pushConfigureJson ;

                _room_properties = room;

                _room_name = room.roomname;
                _room_type = room.roomtype ;
                _is_room_live = (_room_type === 10) ;
                _room_max_videocount = room.maxvideo;

                userinfo.properties = {};
                userinfo.properties.role =response.roomrole  ;
                userinfo.properties.nickname = response.nickname;
                var id = response.thirdid;

                if(id !== undefined && id != "0" && id != ''){
                    userinfo.id = id;
                }
                _myself = TK.RoomUser(userinfo);
                if(_isPlayback){
                    _room_id = room.serial+"_"+_myself.id;
                    if( _room_id && _room_id.indexOf(':playback') === -1 ){
                        _room_id +=":playback" ;
                    }
                }else{
                    _room_id = room.serial;
                }
                L.Logger.info('[tk-fake-sdk]'+(_isPlayback?'initPlaybackInfo to checkroom finshed-->':'')+'_room_max_videocount:'+_room_max_videocount  , 'my id:'+_myself.id , 'room id:'+_room_id  , 'room properties chairmancontrol is:'+ (_room_properties.chairmancontrol ? (window.__TkSdkBuild__ ? L.Utils.encrypt(_room_properties.chairmancontrol):_room_properties.chairmancontrol)  : undefined ) );
            }else{
                L.Logger.warning('[tk-fake-sdk]checkroom failure code is '+ nRet);
            }
            var roomEvt = TK.RoomEvent({type: _isPlayback?'room-checkroom-playback':'room-checkroom', message:{
                ret:nRet ,
                userinfo:userinfo ,
                roominfo:response ,
            }});
            that.dispatchEvent(roomEvt);
        },
        'updateWebAddressInfo':function ( updateWebAddress ) {
            window.TK = TK
            var h5docpar = ''
            if(updateWebAddress && updateWebAddress.h5docpar) {
                h5docpar = updateWebAddress.h5docpar
                if(typeof h5docpar === 'object') {
                    h5docpar = JSON.stringify(h5docpar)
                    if(escape) {
                        h5docpar = escape(h5docpar)
                    }
                }
                if(typeof h5docpar === 'string' && escape) {
                    h5docpar = escape(h5docpar)
                }
                TK.h5docpar = h5docpar
            }
            _web_protocol = updateWebAddress.web_protocol || _web_protocol;
            _web_host = updateWebAddress.web_host || _web_host ;
            _web_port = updateWebAddress.web_port || _web_port ;
            _doc_protocol = updateWebAddress.doc_protocol || _doc_protocol;
            _doc_host = updateWebAddress.doc_host || _doc_host ;
            _doc_port = updateWebAddress.doc_port || _doc_port ;
            _backup_doc_protocol = updateWebAddress.backup_doc_protocol || _backup_doc_protocol;
            _backup_doc_host = updateWebAddress.backup_doc_host || _backup_doc_host ;
            _backup_doc_port = updateWebAddress.backup_doc_port || _backup_doc_port ;
            _backup_doc_host_list = updateWebAddress.backup_doc_host_list || _backup_doc_host_list ;
            if(_doc_host === undefined){
                _doc_host = _web_host ;
            }
            if(_doc_port === undefined){
                _doc_port = _web_port ;
            }
            if(_backup_doc_host === undefined){
                _backup_doc_host = _web_host ;
            }
            if(_backup_doc_port === undefined){
                _backup_doc_port = _web_port ;
            }
            if(!_backup_doc_host_list.length){
                _backup_doc_host_list = [_backup_doc_host];
            }
            if( _whiteboardManagerInstance && _whiteboardManagerInstance.changeCommonWhiteBoardConfigration ){
                var backupDocAddressList = [];
                for(var i=0,length=_backup_doc_host_list.length;i<length;i++){
                    backupDocAddressList.push({
                        protocol:_backup_doc_protocol,
                        hostname:_backup_doc_host_list[i],
                        port: _backup_doc_port,
                    });
                }
                _whiteboardManagerInstance.changeCommonWhiteBoardConfigration({
                    webAddress:{
                        protocol:_web_protocol,
                        hostname:_web_host,
                        port: _web_port,
                    } , //php服务器地址
                    docAddress:{
                        protocol:_doc_protocol,
                        hostname:_doc_host,
                        port: _doc_port,
                    }, //文档服务器地址
                    backupDocAddressList:backupDocAddressList , //备份文档服务器地址列表
                });
            }
            var Evt = TK.RoomEvent( {type: 'room-serveraddress-update', message:{
                web_protocol:_web_protocol  , web_host:_web_host , web_port:_web_port ,
                doc_protocol:_doc_protocol , doc_host:_doc_host ,doc_port:_doc_port ,
                backup_doc_protocol:_backup_doc_protocol , backup_doc_host:_backup_doc_host ,backup_doc_port:_backup_doc_port ,
                backup_doc_host_list:_backup_doc_host_list
            } } );
            that.dispatchEvent(Evt);
        },
        'updateFakeJsSdkInitInfo':function (updateData) {
            for(var key in updateData){
                var value = updateData[key];
                if(value && typeof value === 'object'){
                    TK.global.fakeJsSdkInitInfo[key] = TK.global.fakeJsSdkInitInfo[key] || {} ;
                    for(var innerKey in value){
                        TK.global.fakeJsSdkInitInfo[key][innerKey] = value[innerKey] ;
                    }
                }else{
                    TK.global.fakeJsSdkInitInfo[key] = value ;
                }
            }
            if(updateData.debugLog){
                that.setLogIsDebug(TK.global.fakeJsSdkInitInfo.debugLog);
            }
            _isPlayback = TK.global.fakeJsSdkInitInfo.playback ;
            if( _whiteboardManagerInstance && _whiteboardManagerInstance.changeCommonWhiteBoardConfigration ){
                _whiteboardManagerInstance.changeCommonWhiteBoardConfigration({
                    isPlayback:_isPlayback,  //是否是回放
                    deviceType:TK.global.fakeJsSdkInitInfo.deviceType, //phone , pad  , windowClient , macClient
                    clientType:TK.global.fakeJsSdkInitInfo.mobileInfo.clientType, //android , ios
                });
            }
            var Evt = TK.RoomEvent({type: 'room-updateFakeJsSdkInitInfo', message:updateData });
            that.dispatchEvent(Evt);
        },
        'receiveActionCommand':function (action , cmd) {
            /*目前需要接收的指令有：
             1）更新加载组件的名字（action:'updateLoadComponentName' , cmd:{loadComponentName:loadComponentName} ）， qt客户端加载视频标注用得到
             2) 改变动态ppt的大小（action:'changeDynamicPptSize' , cmd:{width:width , height:height} )  , ios移动端需要用
             3）关闭动态PPT界面里的视频播放（action:'closeDynamicPptWebPlay' , cmd:{} ), 移动端需要
             4）接收全屏的状态通知（action:'fullScreenChangeCallback' , cmd:{isFullScreen:isFullScreen} ) , 移动端需要
             5）回放控制器播放和暂停通知（action:'playbackPlayAndPauseController' , cmd:{play:isPlay} )  , 移动端需要
             6）窗口改变通知：（action:'transmitWindowSize' , cmd:{width:width , height:height} ), 移动端需要
             */
            var Evt = TK.RoomEvent({type: 'room-receiveActionCommand', message:{action:action  , cmd :cmd} });
            that.dispatchEvent(Evt);
        },
        'playback_clearAll':function () {
            if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
            //TODO 回放清除所有的数据是否重置房间模式，有待商讨，这里先重置
            _roomMode = window.TK.ROOM_MODE.NORMAL_ROOM ;
            var roomModeEvt = TK.RoomEvent({type: 'room-mode-changed', message:{
                roomMode:_roomMode
            }});
            that.dispatchEvent(roomModeEvt);
            var roomEvt = TK.RoomEvent({type: 'room-playback-clear_all'});
            that.dispatchEvent(roomEvt);
            _playbackClearAll();
        },
        'duration':function (message) {
            if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
            var roomEvt = TK.RoomEvent({type: 'room-playback-duration' , message:message });
            that.dispatchEvent(roomEvt);
        },
        'playbackEnd':function () {
            if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
            var roomEvt = TK.RoomEvent({type: 'room-playback-playbackEnd'});
            that.dispatchEvent(roomEvt);
        },
        'playback_updatetime':function (message) {
            if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
            var roomEvt = TK.RoomEvent({type: 'room-playback-playback_updatetime' , message:message });
            that.dispatchEvent(roomEvt);
        },
        'msgList':function (messages) {
            L.Logger.debug('[tk-sdk]msgList info:' , L.Utils.toJsonStringify(messages) );
            var roomEvt = TK.RoomEvent({type: 'room-msglist', message:messages});
            that.dispatchEvent(roomEvt);
        } ,
        'participantPublished':function (userinfo) {
            if(typeof userinfo === 'string'){
                userinfo =  L.Utils.toJsonParse(userinfo);
            }
            L.Logger.debug('[tk-sdk]participantPublished userinfo:'+ L.Utils.toJsonStringify(userinfo) );
            if( _roomMode === window.TK.ROOM_MODE.BIG_ROOM ){
                var userCopy = TK.RoomUser(userinfo);
                var user =  _users[userCopy.id] ;
                if( user ){
                    for(var key in userCopy ){
                        user[key] = userCopy [key] ;
                    }
                }else{
                    user = userCopy ;
                }
                _users[user.id]=user;
                if(_isPlayback && _users[user.id]){
                 delete _users[user.id].playbackLeaved ;
                 }
                if( _isPlayback && typeof userinfo === 'object'  ){
                    user.joinTs = userinfo.ts ;
                }
            }
        },
    };

   /*发送消息给中间伪代理服务器*/
    function _sendMessageSocket(type, msg, callback ) {
        L.Logger.debug('[tk-fake-sdk]sendMessageSocket', type, msg);
        console.error('type, msg===>', type, msg);
        if(msg && msg.toID && msg.toID === '__all') {
            msg.toID = "__allExceptAuditor";
        }
        if(msg && msg.toID && msg.toID === "__allExceptSender") {
            msg.toID = "__allExceptAuditorAndSender";
        }
        /*that.socket.emit(type+TK.extendSendInterfaceName, msg, function (respType, respmsg) {
            if (respType === 'success') {
                L.Logger.debug('[tk-fake-sdk]sendMessageSocket success', msg, respmsg);
                if (callback && typeof callback === 'function'){
                    callback(respmsg)
                };
            } else if (respType === 'error'){
                L.Logger.debug('[tk-fake-sdk]sendMessageSocket error', msg, respmsg);
                if (error && typeof error === 'function'){
                    error(respmsg);
                }
            } else {
                L.Logger.debug('[tk-fake-sdk]sendMessageSocket [respType ， msg ， respmsg ] is  ',respType ,  msg, respmsg);
                if (callback && typeof callback === 'function'){
                    callback(respmsg)
                };
            }

        });*/
        that.socket.emit(type, msg , callback);
    };

    /*重置房间状态*/
    function _resetRoomState() {
        if (_users != undefined) {
            _clearRoleList(_rolelist);
            _clearUsers(_users);
        }
        if(_myself){
            _myself.publishstate = TK.PUBLISH_STATE_NONE;
        }
    };

    /*清空所有用户*/
    function _clearUsers(obj) {
        if(!_isPlayback){ //回放则不清空用户列表
            for(var key in obj){
                delete obj[key];
            }
        }else{
            for(var key in obj){
                obj[key].playbackLeaved = true;
            }
        }
    };

    /*清空所有角色列表*/
    function _clearRoleList(obj) {
        if(!_isPlayback){//回放则不清空角色列表
            for(var key in obj){
                delete obj[key];
            }
        }
    };

    /*回放清除所有sdk相关数据*/
    function _playbackClearAll() {
        if(!_isPlayback){L.Logger.error('[tk-fake-sdk]No playback environment, no execution playbackClearAll!');return ;} ;
        if (_users != undefined) {
            _clearRoleList(_rolelist);
            _clearUsers(_users);
        }
        if(_myself != null){
            _myself.publishstate = TK.PUBLISH_STATE_NONE;
        }
    };

    /*处理纯音频教室的切换
     * @params isOnlyAudioRoom:是否是纯音频*/
    function _handleSwitchOnlyAudioRoom(isOnlyAudioRoom, fromID) {
        if (TK.isOnlyAudioRoom === isOnlyAudioRoom) {
            return;
        }
        TK.isOnlyAudioRoom = isOnlyAudioRoom;
        var connectEvt = TK.RoomEvent({type: 'room-audiovideostate-switched',  message:{fromId:fromID ,  onlyAudio:TK.isOnlyAudioRoom }});
        that.dispatchEvent(connectEvt);
    }

    function _removeBigRoomUsers() {
        if(_roomMode === window.TK.ROOM_MODE.BIG_ROOM ){
            for(var userid in _users){
                if(userid !== _myself.id && _users[userid].role !== window.TK.ROOM_ROLE.TEACHER && _users[userid].role !== window.TK.ROOM_ROLE.ASSISTANT){ //角色不是老师和助教且下台用户，则从列表中删除
                    if(_users[userid].publishstate === TK.PUBLISH_STATE_NONE){
                        delete  _users[userid] ;
                    }
                }
            }
        }
    }

    that.setLogIsDebug(TK.global.fakeJsSdkInitInfo.debugLog);
    if(TK.SDKNATIVENAME === 'QtNativeClientRoom'){ //初始化QT客户端变量
        try{
            if(qt && qt.webChannelTransport){
                new QWebChannel(qt.webChannelTransport, function(channel) {
                    window.qtContentTkClient = channel.objects.bridge;
                    for(var type in socketBindListMap){ //绑定socket相关的事件
                        that.socket.on(type , socketBindListMap[type]);
                    }
                    that.socket.bindAwitSocketListEvent();
                    L.Logger.debug('[tk-sdk]qtWebChannel init finshed!');
                    var roomEvt = TK.RoomEvent({type: 'room-qtWebChannel-finshed'});
                    that.dispatchEvent(roomEvt);
                });
            }
        }catch (e){
            L.Logger.error('[tk-fake-sdk]qt or qt.webChannelTransport is not exist  ' );
        }
    }else{
        for(var type in socketBindListMap){ //绑定socket相关的事件
            that.socket.on(type , socketBindListMap[type]);
        }
    }
    return that;
};

;(function () {
    var DEV = false ;
    var _getUrlParams = function(key){
        // var urlAdd = decodeURI(window.location.href);
        var urlAdd = decodeURIComponent(window.location.href);
        var urlIndex = urlAdd.indexOf("?");
        var urlSearch = urlAdd.substring(urlIndex + 1);
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");   //reg表示匹配出:$+url传参数名字=值+$,并且$可以不存在，这样会返回一个数组
        var arr = urlSearch.match(reg);
        if(arr != null) {
            return arr[2];
        } else {
            return "";
        }
    };
    if(window.__SDKDEV__ !== undefined && window.__SDKDEV__!== null && typeof window.__SDKDEV__ === 'boolean'){
        try{
            DEV = window.__SDKDEV__ ;
        }catch (e){
            DEV = false ;
        }
    }
    var debug = (DEV || _getUrlParams('debug') );
    window.__TkSdkBuild__ = !debug ;
    if(window.localStorage){
        var debugStr =  debug ? '*' : 'none';
        window.localStorage.setItem('debug' ,debugStr );
    }
})();/*global L, document*/
'use strict';
/*
 * Class Stream represents a local or a remote Stream in the Room. It will handle the WebRTC stream
 * and identify the stream and where it should be drawn.
 */
var TK = TK || {};

TK.PUBLISH_STATE_NONE = 0; //下台
TK.PUBLISH_STATE_AUDIOONLY = 1; //只发布音频
TK.PUBLISH_STATE_VIDEOONLY = 2; //只发布视频
TK.PUBLISH_STATE_BOTH = 3; //音视频都发布
TK.PUBLISH_STATE_MUTEALL = 4; //音视频都关闭
TK.RoomUser = function (userinfo) {
    if (userinfo == undefined || userinfo.properties === undefined) {
        L.Logger.warning('[tk-fake-sdk]Invalidate user info', id, properties);
        return undefined;
    }

    var id = userinfo.id;
    if(typeof userinfo.properties === 'string'){
        userinfo.properties = L.Utils.toJsonParse(userinfo.properties);
    }
    var properties = userinfo.properties;
    L.Logger.debug('[tk-fake-sdk]RoomUser', id, properties);

    var that={};
    that.id = id;
    that.watchStatus = 0;//0 idel 1 sdp 2 ice 3 streaming 4 canceling  

    for (var key in properties) {
        if (key != 'id' && key != 'watchStatus')
            that[key]=properties[key];
    }

    that.publishstate = that.publishstate || TK.PUBLISH_STATE_NONE;
    return that;
};
/*global document, console*/
'use strict';
var L = L || {};
var TK = TK || {} ;
/*
 * API to write logs based on traditional logging mechanisms: debug, trace, info, warning, error
 */
L.Logger = (function (L) {
    var DEBUG = 0,
        TRACE = 1,
        INFO = 2,
        WARNING = 3,
        ERROR = 4,
        NONE = 5,
        enableLogPanel,
        setLogLevel,
        setOutputFunction,
        setLogPrefix,
        outputFunction,
        logPrefix = '',
        print,
        debug,
        trace,
        info,
        log,
        warning,
        error , 
		setLogDevelopment,
		developmentEnvironment = false;

    // By calling this method we will not use console.log to print the logs anymore.
    // Instead we will use a <textarea/> element to write down future logs
    enableLogPanel = function () {
        L.Logger.panel = document.createElement('textarea');
        L.Logger.panel.setAttribute('id', 'licode-logs');
        L.Logger.panel.setAttribute('style', 'position:fixed;left:0;top:0;width: 100%; height: 100%; display: none;z-index:9999;  user-select: text ;-webkit-user-select: text; -moz-user-select: text ; -ms-user-select: text ;');
        L.Logger.panel.setAttribute('rows', 20);
        L.Logger.panel.setAttribute('cols', 20);
        L.Logger.panel.setAttribute('readOnly', true);
        if(TK.SDKNATIVENAME === 'QtNativeClientRoom'){
            document.oncontextmenu = null ;
            document.oncontextmenu = function() {return true;};
        }
        var button = document.createElement('button');
        button.innerHTML = 'open log';
        button.setAttribute('style', 'position:fixed;left:0;top:0;z-index:10000;background:gold;');
        button.onclick = function () {
            if(button.innerHTML === 'open log'){
                L.Logger.panel.style.display = 'block';
                button.innerHTML = 'close log';
            }else{
                L.Logger.panel.style.display = 'none';
                button.innerHTML = 'open log';
            }
        };
        document.body.appendChild(button);
        document.body.appendChild(L.Logger.panel);
    };

    // It sets the new log level. We can set it to NONE if we do not want to print logs
    setLogLevel = function (level) {
        if (level > L.Logger.NONE) {
            level = L.Logger.NONE;
        } else if (level < L.Logger.DEBUG) {
            level = L.Logger.DEBUG;
        }
        L.Logger.logLevel = level;
    };
	
	setLogDevelopment = function(isDevelopmentEnvironment){
		developmentEnvironment = isDevelopmentEnvironment ;
	};
	
    outputFunction = function (args , level) {
        try{
            switch (level){
                case L.Logger.DEBUG:
                    developmentEnvironment ? console.warn.apply(console, args) : console.debug.apply(console, args)  ;
                    break;
                case L.Logger.TRACE:
                    console.trace.apply(console, args);
                    break;
                case L.Logger.INFO:
                    developmentEnvironment ? console.warn.apply(console, args) :  console.info.apply(console, args);
                    break;
                case L.Logger.WARNING:
                    console.warn.apply(console, args);
                    break;
                case L.Logger.ERROR:
                    console.error.apply(console, args);
                    break;
                case L.Logger.NONE:
					console.warn("log level is none!");
                    break;
                default:
                    developmentEnvironment ? console.warn.apply(console, args) : console.log.apply(console, args);
                    break;
            }
        }catch (e){
            console.log.apply(console, args);
        }
    };

    setOutputFunction = function (newOutputFunction) {
        outputFunction = newOutputFunction;
    };

    setLogPrefix = function (newLogPrefix) {
        logPrefix = newLogPrefix;
    };

    // Generic function to print logs for a given level:
    //  L.Logger.[DEBUG, TRACE, INFO, WARNING, ERROR]
    print = function (level) {
        var out = logPrefix;
        if (level < L.Logger.logLevel) {
            return;
        }
        if (level === L.Logger.DEBUG) {
            out = out + 'DEBUG('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.TRACE) {
            out = out + 'TRACE('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.INFO) {
            out = out + 'INFO('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.WARNING) {
            out = out + 'WARNING('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.ERROR) {
            out = out + 'ERROR('+new Date().toLocaleString()+')';
        }
        out = out + ':';
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        var tempArgs = args.slice(1);
        args = [out].concat(tempArgs);
        if (L.Logger.panel !== undefined) {
            var tmp = '';
            for (var idx = 0; idx < args.length; idx++) {
                tmp = tmp + (typeof args[idx] === 'object'?L.Utils.toJsonStringify( args[idx]) :  args[idx]);
            }
            L.Logger.panel.value = L.Logger.panel.value + '\n' + tmp;
            outputFunction.apply(L.Logger, [args , level] );
        } else {
            outputFunction.apply(L.Logger, [args , level] );
        }
    };

    // It prints debug logs
    debug = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.DEBUG].concat(args));
    };

    // It prints trace logs
    trace = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.TRACE].concat(args));
    };

    // It prints info logs
    info = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.INFO].concat(args));
    };

    // It prints warning logs
    warning = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.WARNING].concat(args));
    };

    // It prints error logs
    error = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.ERROR].concat(args));
    };

    return {
        DEBUG: DEBUG,
        TRACE: TRACE,
        INFO: INFO,
        WARNING: WARNING,
        ERROR: ERROR,
        NONE: NONE,
		setLogDevelopment:setLogDevelopment , 
        enableLogPanel: enableLogPanel,
        setLogLevel: setLogLevel,
        setOutputFunction: setOutputFunction,
        setLogPrefix: setLogPrefix,
        print:print ,
        debug: debug,
        trace: trace,
        info: info,
        warning: warning,
        error: error 
    };
}(L));


/*设置日志输出,通过配置项*/
TK.tkLogPrintConfig =  function (socketLogConfig , loggerConfig , adpConfig ) {
    loggerConfig = loggerConfig || {} ;
    socketLogConfig = socketLogConfig || {} ;
    adpConfig = adpConfig || {} ;
    var development = loggerConfig.development != undefined  ? loggerConfig.development : true;
    var logLevel =  loggerConfig.logLevel  != undefined  ? loggerConfig.logLevel  : 0;
    var debug = socketLogConfig.debug != undefined  ? socketLogConfig.debug  : true ;
    var webrtcLogDebug =  adpConfig.webrtcLogDebug!= undefined  ? adpConfig.webrtcLogDebug : true ;
    L.Logger.setLogDevelopment(development);
    L.Logger.setLogLevel(logLevel);
    if(L.Utils.localStorage){
        var debugStr =  debug ? '*' : 'none';
        L.Utils.localStorage.setItem('debug' ,debugStr );
    }
    window.webrtcLogDebug = webrtcLogDebug;
};


/**
 * SDK常量
 * @class L.Constant
 * @description   提供常量存储对象
 * @author QiuShao
 * @date 2017/7/29
 */
'use strict';
var L = L || {};
L.Constant = (function () {
    return {
        clientType:{
            ios:'ios' ,
            android:'android' ,
		},
		IOS:'ios' ,
        ANDROID:'android' ,
        LOGLEVEL:{
            DEBUG:0, //debug 级别日志
            TRACE: 1, //trace 级别日志
            INFO: 2, //info 级别日志
            WARNING: 3, //warning 级别日志
            ERROR: 4, //error 级别日志
            NONE: 5 //不打印日志
        }
    };
}(L));
/**
 * SDK状态码
 * @class StatusCode
 * @description   提供状态码
 * @author QiuShao
 * @date 2018/06/08
 * */
'use strict';
window.TK = window.TK || {};

/*错误码*/
window.TK_ERR = {
    DEVICE_ERROR_UnknownError:10000 , //设备不可用错误码
    DEVICE_ERROR_NotFoundError:10001 , //没有找到设备错误码
    DEVICE_ERROR_NotAllowedError:10002 , //设备没有授权错误码
    DEVICE_ERROR_NotReadableError:10003 , //设备占用错误码
    DEVICE_ERROR_OverconstrainedError:10004 , //设备无法满足约束配置错误码
    DEVICE_ERROR_TypeError:10005 , //设备约束对象为空或者约束都设置为false错误码
    TIMEOUT_ERROR:10006, //超时错误码
};

/*视频mode常量*/
window.TK_VIDEO_MODE = {
    ASPECT_RATIO_CONTAIN:20001 , //视频默认模式（不裁剪）
    ASPECT_RATIO_COVER:20002 , //视频裁剪模式
};

/*角色常量*/
window.TK.ROOM_ROLE = {
    TEACHER:0 , //老师（主讲）
    ASSISTANT:1 , //助教
    STUDENT:2 , //学生
    AUDIT:3 , //旁听（直播用户）
    PATROL:4 , //巡检员（巡课）
    SYSTEM_ADMIN:10 , //系统管理员
    ENTERPRISE_ADMIN:11 , //企业管理员
    ADMIN:12 , //管理员
    PLAYBACK:-1 , //回放者
};

/*房间模式*/
window.TK.ROOM_MODE = {
    NORMAL_ROOM:'normalRoom',
    BIG_ROOM:'bigRoom',
};

/*错误通知*/
window.TK.ERROR_NOTICE = {
    PUBLISH_AUDIO_VIDEO_FAILURE:40001, //发布音视频失败
    SHARE_MEDIA_FAILURE:40003, //共享媒体文件失败
    SHARE_FILE_FAILURE:40004, //共享本地媒体文件失败
    SHARE_SCREEN_FAILURE:40005, //共享屏幕失败
    SUBSCRIBE_AUDIO_VIDEO_FAILURE:40007, //订阅音视频失败
    SUBSCRIBE_MEDIA_FAILURE:40008, //订阅媒体文件失败
    SUBSCRIBE_FILE_FAILURE:40009, //订阅本地媒体文件失败
    SUBSCRIBE_SCREEN_FAILURE:40010, //订阅屏幕共享失败
    UNSUBSCRIBE_AUDIO_VIDEO_FAILURE:40013, //取消订阅音视频失败
    UNSUBSCRIBE_MEDIA_FAILURE:40014, //取消订阅媒体文件失败
    UNSUBSCRIBE_FILE_FAILURE:40015, //取消订阅本地媒体文件失败
    UNSUBSCRIBE_SCREEN_FAILURE:40016, //取消订阅屏幕共享失败
    UNPUBLISH_AUDIO_VIDEO_FAILURE:40019, //取消发布音视频失败
    STOP_MEDIA_FAILURE:40020, //停止共享媒体文件失败
    STOP_FILE_FAILURE:40021, //停止共享本地媒体文件失败
    STOP_SCREEN_FAILURE:40022, //停止共享屏幕失败
    UDP_CONNECTION_FAILED:40023, //UDP连接失败（UDP不通）
    UDP_CONNECTION_INTERRUPT:40024, //UDP连接中断（UDP之前通信正常，之后中断了）
};

/**
 * SDK工具类
 * @class L.Utils
 * @description   提供SDK所需要的工具
 * @author QiuShao
 * @date 2017/7/29
 */
'use strict';
var L = L || {};
L.aexInstance = undefined ;
;(function() {
    var Aes = {};  // Aes namespace

    /**
     * AES Cipher function: encrypt 'input' state with Rijndael algorithm
     *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage
     *
     * @param {Number[]} input 16-byte (128-bit) input state array
     * @param {Number[][]} w   Key schedule as 2D byte-array (Nr+1 x Nb bytes)
     * @returns {Number[]}     Encrypted output state array
     */
    Aes.cipher = function(input, w) {    // main Cipher function [§5.1]
        var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
        var Nr = w.length/Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

        var state = [[],[],[],[]];  // initialise 4xNb byte-array 'state' with input [§3.4]
        for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

        state = Aes.addRoundKey(state, w, 0, Nb);

        for (var round=1; round<Nr; round++) {
            state = Aes.subBytes(state, Nb);
            state = Aes.shiftRows(state, Nb);
            state = Aes.mixColumns(state, Nb);
            state = Aes.addRoundKey(state, w, round, Nb);
        }

        state = Aes.subBytes(state, Nb);
        state = Aes.shiftRows(state, Nb);
        state = Aes.addRoundKey(state, w, Nr, Nb);

        var output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
        for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];
        return output;
    }

    /**
     * Perform Key Expansion to generate a Key Schedule
     *
     * @param {Number[]} key Key as 16/24/32-byte array
     * @returns {Number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes)
     */
    Aes.keyExpansion = function(key) {  // generate Key Schedule (byte-array Nr+1 x Nb) from Key [§5.2]
        var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
        var Nk = key.length/4  // key length (in words): 4/6/8 for 128/192/256-bit keys
        var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

        var w = new Array(Nb*(Nr+1));
        var temp = new Array(4);

        for (var i=0; i<Nk; i++) {
            var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
            w[i] = r;
        }

        for (var i=Nk; i<(Nb*(Nr+1)); i++) {
            w[i] = new Array(4);
            for (var t=0; t<4; t++) temp[t] = w[i-1][t];
            if (i % Nk == 0) {
                temp = Aes.subWord(Aes.rotWord(temp));
                for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
            } else if (Nk > 6 && i%Nk == 4) {
                temp = Aes.subWord(temp);
            }
            for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
        }

        return w;
    }

    /*
     * ---- remaining routines are private, not called externally ----
     */

    Aes.subBytes = function(s, Nb) {    // apply SBox to state S [§5.1.1]
        for (var r=0; r<4; r++) {
            for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
        }
        return s;
    }

    Aes.shiftRows = function(s, Nb) {    // shift row r of state S left by r bytes [§5.1.2]
        var t = new Array(4);
        for (var r=1; r<4; r++) {
            for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
            for (var c=0; c<4; c++) s[r][c] = t[c];         // and copy back
        }          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
        return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
    }

    Aes.mixColumns = function(s, Nb) {   // combine bytes of each col of state S [§5.1.3]
        for (var c=0; c<4; c++) {
            var a = new Array(4);  // 'a' is a copy of the current column from 's'
            var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
            for (var i=0; i<4; i++) {
                a[i] = s[i][c];
                b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;

            }
            // a[n] ^ b[n] is a•{03} in GF(2^8)
            s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
            s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
            s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
            s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
        }
        return s;
    }

    Aes.addRoundKey = function(state, w, rnd, Nb) {  // xor Round Key into state S [§5.1.4]
        for (var r=0; r<4; r++) {
            for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
        }
        return state;
    }

    Aes.subWord = function(w) {    // apply SBox to 4-byte word w
        for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
        return w;
    }

    Aes.rotWord = function(w) {    // rotate 4-byte word w left by one byte
        var tmp = w[0];
        for (var i=0; i<3; i++) w[i] = w[i+1];
        w[3] = tmp;
        return w;
    }

// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
    Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
        0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
        0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
        0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
        0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
        0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
        0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
        0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
        0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
        0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
        0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
        0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
        0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
        0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
        0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
        0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
    Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
        [0x01, 0x00, 0x00, 0x00],
        [0x02, 0x00, 0x00, 0x00],
        [0x04, 0x00, 0x00, 0x00],
        [0x08, 0x00, 0x00, 0x00],
        [0x10, 0x00, 0x00, 0x00],
        [0x20, 0x00, 0x00, 0x00],
        [0x40, 0x00, 0x00, 0x00],
        [0x80, 0x00, 0x00, 0x00],
        [0x1b, 0x00, 0x00, 0x00],
        [0x36, 0x00, 0x00, 0x00] ];


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  AES Counter-mode implementation in JavaScript (c) Chris Veness 2005-2012                      */
    /*   - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf                       */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    Aes.Ctr = {};  // Aes.Ctr namespace: a subclass or extension of Aes

    /**
     * Encrypt a text using AES encryption in Counter mode of operation
     *
     * Unicode multi-byte character safe
     *
     * @param {String} plaintext Source text to be encrypted
     * @param {String} password  The password to use to generate a key
     * @param {Number} nBits     Number of bits to be used in the key (128, 192, or 256)
     * @returns {string}         Encrypted text
     */
    Aes.Ctr.encrypt = function(plaintext, password, nBits) {
        password = password  ||  'talk_2018_@beijing_20180310_talk_2018_@beijing' ;
        nBits = nBits || 256 ;
        var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
        if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
        plaintext = Utf8.encode(plaintext);
        password = Utf8.encode(password);
        //var t = new Date();  // timer

        // use AES itself to encrypt password to get cipher key (using plain password as source for key
        // expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
        var nBytes = nBits/8;  // no bytes in key (16/24/32)
        var pwBytes = new Array(nBytes);
        for (var i=0; i<nBytes; i++) {  // use 1st 16/24/32 chars of password for key
            pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
        }
        var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));  // gives us 16-byte key
        key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

        // initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec,
        // [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
        var counterBlock = new Array(blockSize);

        var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
        var nonceMs = nonce%1000;
        var nonceSec = Math.floor(nonce/1000);
        var nonceRnd = Math.floor(Math.random()*0xffff);

        for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
        for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
        for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;

        // and convert it to a string to go on the front of the ciphertext
        var ctrTxt = '';
        for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

        // generate key schedule - an expansion of the key into distinct Key Rounds for each round
        var keySchedule = Aes.keyExpansion(key);

        var blockCount = Math.ceil(plaintext.length/blockSize);
        var ciphertxt = new Array(blockCount);  // ciphertext as array of strings

        for (var b=0; b<blockCount; b++) {
            // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
            for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
            for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8)

            var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // -- encrypt counter block --

            // block size is reduced on final block
            var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
            var cipherChar = new Array(blockLength);

            for (var i=0; i<blockLength; i++) {  // -- xor plaintext with ciphered counter char-by-char --
                cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
                cipherChar[i] = String.fromCharCode(cipherChar[i]);
            }
            ciphertxt[b] = cipherChar.join('');
        }

        // Array.join is more efficient than repeated string concatenation in IE
        var ciphertext = ctrTxt + ciphertxt.join('');
        ciphertext = Base64.encode(ciphertext);  // encode in base64

        //alert((new Date()) - t);
        return ciphertext;
    }

    /**
     * Decrypt a text encrypted by AES in counter mode of operation
     *
     * @param {String} ciphertext Source text to be encrypted
     * @param {String} password   The password to use to generate a key
     * @param {Number} nBits      Number of bits to be used in the key (128, 192, or 256)
     * @returns {String}          Decrypted text
     */
    Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
        password = password  ||  'talk_2018_@beijing_20180310_talk_2018_@beijing' ;
        nBits = nBits || 256 ;
        var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
        if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
        ciphertext = Base64.decode(ciphertext);
        password = Utf8.encode(password);
        //var t = new Date();  // timer

        // use AES to encrypt password (mirroring encrypt routine)
        var nBytes = nBits/8;  // no bytes in key
        var pwBytes = new Array(nBytes);
        for (var i=0; i<nBytes; i++) {
            pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
        }
        var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
        key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

        // recover nonce from 1st 8 bytes of ciphertext
        var counterBlock = new Array(8);
        var ctrTxt = '';
        ctrTxt = ciphertext.slice(0, 8);
        for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

        // generate key schedule
        var keySchedule = Aes.keyExpansion(key);

        // separate ciphertext into blocks (skipping past initial 8 bytes)
        var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
        var ct = new Array(nBlocks);
        for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
        ciphertext = ct;  // ciphertext is now array of block-length strings

        // plaintext will get generated block-by-block into array of block-length strings
        var plaintxt = new Array(ciphertext.length);

        for (var b=0; b<nBlocks; b++) {
            // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
            for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
            for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

            var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // encrypt counter block

            var plaintxtByte = new Array(ciphertext[b].length);
            for (var i=0; i<ciphertext[b].length; i++) {
                // -- xor plaintxt with ciphered counter byte-by-byte --
                plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
                plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
            }
            plaintxt[b] = plaintxtByte.join('');
        }

        // join array of blocks into single plaintext string
        var plaintext = plaintxt.join('');
        plaintext = Utf8.decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars

        //alert((new Date()) - t);
        return plaintext;
    }


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2012                          */
    /*    note: depends on Utf8 class                                                                 */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    var Base64 = {};  // Base64 namespace

    Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    /**
     * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
     * (instance method extending String object). As per RFC 4648, no newlines are added.
     *
     * @param {String} str The string to be encoded as base-64
     * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded
     *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
     * @returns {String} Base64-encoded string
     */
    Base64.encode = function(str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
        utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
        var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
        var b64 = Base64.code;

        plain = utf8encode ? str.encodeUTF8() : str;

        c = plain.length % 3;  // pad string to length of multiple of 3
        if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
        // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

        for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
            o1 = plain.charCodeAt(c);
            o2 = plain.charCodeAt(c+1);
            o3 = plain.charCodeAt(c+2);

            bits = o1<<16 | o2<<8 | o3;

            h1 = bits>>18 & 0x3f;
            h2 = bits>>12 & 0x3f;
            h3 = bits>>6 & 0x3f;
            h4 = bits & 0x3f;

            // use hextets to index into code string
            e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        }
        coded = e.join('');  // join() is far faster than repeated string concatenation in IE

        // replace 'A's from padded nulls with '='s
        coded = coded.slice(0, coded.length-pad.length) + pad;

        return coded;
    }

    /**
     * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
     * (instance method extending String object). As per RFC 4648, newlines are not catered for.
     *
     * @param {String} str The string to be decoded from base-64
     * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded
     *   from UTF8 after conversion from base64
     * @returns {String} decoded string
     */
    Base64.decode = function(str, utf8decode) {
        utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
        var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
        var b64 = Base64.code;

        coded = utf8decode ? str.decodeUTF8() : str;


        for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
            h1 = b64.indexOf(coded.charAt(c));
            h2 = b64.indexOf(coded.charAt(c+1));
            h3 = b64.indexOf(coded.charAt(c+2));
            h4 = b64.indexOf(coded.charAt(c+3));

            bits = h1<<18 | h2<<12 | h3<<6 | h4;

            o1 = bits>>>16 & 0xff;
            o2 = bits>>>8 & 0xff;
            o3 = bits & 0xff;

            d[c/4] = String.fromCharCode(o1, o2, o3);
            // check for padding
            if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
            if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
        }
        plain = d.join('');  // join() is far faster than repeated string concatenation in IE

        return utf8decode ? plain.decodeUTF8() : plain;
    }


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
    /*              single-byte character encoding (c) Chris Veness 2002-2012                         */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    var Utf8 = {};  // Utf8 namespace

    /**
     * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
     * (BMP / basic multilingual plane only)
     *
     * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
     *
     * @param {String} strUni Unicode string to be encoded as UTF-8
     * @returns {String} encoded string
     */
    Utf8.encode = function(strUni) {
        // use regular expressions & String.replace callback function for better efficiency
        // than procedural approaches
        var strUtf = strUni.replace(
            /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
        );
        strUtf = strUtf.replace(
            /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
        );
        return strUtf;
    }

    /**
     * Decode utf-8 encoded string back into multi-byte Unicode characters
     *
     * @param {String} strUtf UTF-8 string to be decoded back to Unicode
     * @returns {String} decoded string
     */
    Utf8.decode = function(strUtf) {
        // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
        var strUni = strUtf.replace(
            /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
            function(c) {  // (note parentheses for precence)
                var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
                return String.fromCharCode(cc); }
        );
        strUni = strUni.replace(
            /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
            function(c) {  // (note parentheses for precence)
                var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
                return String.fromCharCode(cc); }
        );
        return strUni;
    }

    L.aexInstance = Aes.Ctr ;
})();

L.Utils = ( function () {
    var _handleFunction = undefined ;
    var loged = {
        localStorage:false ,
        sessionStorage:false ,
    };
    _handleFunction = {
        handleMediaPlayOnEvent:function ( mediaElement  , mediaElementId){
            try{
                L.Utils.removeEvent( mediaElement , 'canplay' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId ) ) ;
                L.Utils.removeEvent( mediaElement , 'loadedmetadata' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                L.Utils.removeEvent( mediaElement , 'loadeddata' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                if(mediaElement && mediaElement.play && typeof mediaElement.play === 'function'){
                    var playHandler = mediaElement.play();
                    if(playHandler && playHandler.catch && typeof playHandler.catch === 'function'){
                        playHandler.catch(function (err) {
                            L.Logger.error('[tk-fake-sdk]media play err:' , L.Utils.toJsonStringify(err)   ,  (mediaElementId ? (' , media element id is '+mediaElementId) : (' media element:')  ) , (!mediaElementId?mediaElement:''));
                        })
                    }
                }
            }catch (error){
                L.Logger.error('[tk-fake-sdk]media play error:' ,  L.Utils.toJsonStringify(error)   ,  (mediaElementId ? (' , media element id is '+mediaElementId) : (' media element:')  ) , (!mediaElementId?mediaElement:''));
            }
        },
        handleMediaPauseOnEvent:function ( mediaElement, mediaElementId){
            try{
                L.Utils.removeEvent( mediaElement , 'canplay' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId ) ) ;
                L.Utils.removeEvent( mediaElement , 'loadedmetadata' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                L.Utils.removeEvent( mediaElement , 'loadeddata' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                if(mediaElement && mediaElement.pause && typeof mediaElement.pause === 'function'){
                    var pauseHandler = mediaElement.pause();
                    if(pauseHandler && pauseHandler.catch && typeof pauseHandler.catch === 'function'){
                        pauseHandler.catch(function (err) {
                            L.Logger.error('[tk-fake-sdk]media pause err:' , L.Utils.toJsonStringify(err)   ,  (mediaElementId ? (' , media element id is '+mediaElementId) : (' media element:')  ) , (!mediaElementId?mediaElement:''));
                        })
                    }
                }
            }catch (error){
                L.Logger.error('[tk-fake-sdk]media pause error:' ,  L.Utils.toJsonStringify(error)   ,  (mediaElementId ? (' , media element id is '+mediaElementId) : (' media element:')  ) , (!mediaElementId?mediaElement:''));
            }
        }
    };
    return {
        /**绑定事件
         @method addEvent
         @param   {element} element 添加事件元素
         {string} eType 事件类型
         {Function} handle 事件处理器
         {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
         */
        addEvent:function(element, eType, handle, bol ){
            bol = (bol!=undefined && bol!=null)?bol:false ;
            if(element.addEventListener){           //如果支持addEventListener
                element.addEventListener(eType, handle, bol);
            }else if(element.attachEvent){          //如果支持attachEvent
                element.attachEvent("on"+eType, handle);
            }else{                                  //否则使用兼容的onclick绑定
                element["on"+eType] = handle;
            }
        },
        /**事件解绑
         @method addEvent
         @param   {element} element 添加事件元素
         {string} eType 事件类型
         {Function} handle 事件处理器
         {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
         */
        removeEvent:function(element, eType, handle, bol ) {
            bol = (bol!=undefined && bol!=null)?bol:false ;
            if(element.removeEventListener){
                element.removeEventListener(eType, handle, bol);
            }else if(element.detachEvent){
                element.detachEvent("on"+eType, handle);
            }else{
                element["on"+eType] = null;
            }
        },
        /*toStringify*/
        toJsonStringify:function (json , isChange) {
            isChange = isChange!=undefined?isChange:true;
            if(!isChange){
                return json ;
            }
            if(!json){
                return json ;
            }
            try{
                if( typeof  json !== 'object'){
                    // L.Logger.debug('[tk-fake-sdk]toJsonStringify:json must is object!');
                    return json ;
                }
                var jsonString = JSON.stringify(json);
                if(jsonString){
                    json = jsonString ;
                }else{
                    L.Logger.debug('[tk-fake-sdk]toJsonStringify:data is not json!');
                }
            }catch (e){
                L.Logger.debug('[tk-fake-sdk]toJsonStringify:data is not json!');
            }
            return json ;
        },
        /*toParse*/
        toJsonParse:function (jsonStr , isChange) {
            isChange = isChange!=undefined?isChange:true;
            if(!isChange){
                return jsonStr ;
            }
            if(!jsonStr){
                return jsonStr ;
            }
            try{
                if( typeof  jsonStr !== 'string'){
                    // L.Logger.debug('[tk-fake-sdk]toJsonParse:jsonStr must is string!');
                    return jsonStr ;
                }
                var json =  JSON.parse(jsonStr);
                if(json){
                    jsonStr = json;
                }else{
                    L.Logger.debug('[tk-fake-sdk]toJsonParse:data is not json string!');
                }
            }catch (e){
                L.Logger.debug('[tk-fake-sdk]toJsonParse:data is not json string!');
            }
            return jsonStr ;
        },
        /**
         * 加密函数
         * @param str 待加密字符串
         * @returns {string}
         */
        encrypt: function(str , encryptRandom  , encryptKey , encryptBit) {
            if(!str){return str;}
            encryptKey = encryptKey || TK.hexEncryptDecryptKey  ;
            encryptBit = encryptBit || TK.hexEncryptDecryptBit  ;
            encryptRandom = encryptRandom != undefined ? encryptRandom : 'talk_2018_@beijing' ;
            var out = L.aexInstance.encrypt(str ,encryptKey  ,encryptBit);
            out = encryptRandom + out + encryptRandom ;
            return out
        },
        /**
         * 解密函数
         * @param str 待解密字符串
         * @returns {string}*/
        decrypt: function(str , encryptRandom , encryptKey , encryptBit){
            if(!str){return str;}
            encryptKey = encryptKey || TK.hexEncryptDecryptKey  ;
            encryptBit = encryptBit || TK.hexEncryptDecryptBit  ;
            encryptRandom = encryptRandom != undefined ? encryptRandom : 'talk_2018_@beijing' ;
            var regExp = new RegExp( encryptRandom , 'gm' ) ;
            str = str.replace( regExp , '' );
            var out = L.aexInstance.decrypt(str ,encryptKey  ,encryptBit);
            return out
        },
        /*媒体文件的播放*/
        mediaPlay:function(mediaElement){
            var mediaElementId = undefined ;
            if(mediaElement && typeof mediaElement === 'string'){
                mediaElement = document.getElementById(mediaElement);
            }else if(mediaElement &&  /(audio|video)/g.test(mediaElement.nodeName.toLowerCase()) && mediaElement.getAttribute && typeof mediaElement.getAttribute === 'function'){
                mediaElementId = mediaElement.getAttribute('id');
            }
            if(mediaElement &&  /(audio|video)/g.test(mediaElement.nodeName.toLowerCase()) ){
                if(mediaElement.readyState !== 0){
                    _handleFunction.handleMediaPlayOnEvent(mediaElement , mediaElementId);
                }else{
                    L.Utils.removeEvent( mediaElement , 'canplay' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId ) ) ;
                    L.Utils.removeEvent( mediaElement , 'loadedmetadata' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.removeEvent( mediaElement , 'loadeddata' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.addEvent(mediaElement  , 'canplay'  , _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement  , mediaElementId ) ) ;
                    L.Utils.addEvent(mediaElement  , 'loadedmetadata'  , _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.addEvent(mediaElement  , 'loadeddata'  , _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement  , mediaElementId ) ) ;
                }
            }
        },
        /*媒体文件的播放*/
        mediaPause:function(mediaElement){
            var mediaElementId = undefined ;
            if(mediaElement && typeof mediaElement === 'string'){
                mediaElement = document.getElementById(mediaElement);
            }else if(mediaElement &&  /(audio|video)/g.test(mediaElement.nodeName.toLowerCase()) && mediaElement.getAttribute && typeof mediaElement.getAttribute === 'function'){
                mediaElementId = mediaElement.getAttribute('id');
            }
            if(mediaElement &&  /(audio|video)/g.test(mediaElement.nodeName.toLowerCase()) ){
                if(mediaElement.readyState !== 0){
                    _handleFunction.handleMediaPauseOnEvent(mediaElement , mediaElementId);
                }else{
                    L.Utils.removeEvent( mediaElement , 'canplay' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId ) ) ;
                    L.Utils.removeEvent( mediaElement , 'loadedmetadata' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.removeEvent( mediaElement , 'loadeddata' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.addEvent(mediaElement  , 'canplay'  , _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement  , mediaElementId ) ) ;
                    L.Utils.addEvent(mediaElement  , 'loadedmetadata'  , _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.addEvent(mediaElement  , 'loadeddata'  , _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement  , mediaElementId ) ) ;
                }
            }
        },
        /*本地存储*/
        localStorage:{
            setItem:function (key,value) {
                try{
                    if(window.localStorage){
                        if(window.localStorage.setItem){
                            window.localStorage.setItem(key , value);
                        }else{
                            L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage.setItem , key is '+key+' , value is '+value+'!');
                        }
                    }else{
                        if(!loged.localStorage){
                            loged.localStorage = true ;
                            L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage!');
                        }
                    }
                }catch (err){
                    if(!loged.localStorage){
                        loged.localStorage = true ;
                        L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                }
            },
            getItem:function (key) {
                try{
                    if(window.localStorage){
                        if(window.localStorage.getItem){
                            return window.localStorage.getItem(key);
                        }else{
                            L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage.getItem , key is '+key+' !');
                            return "" ;
                        }
                    }else{
                        if(!loged.localStorage){
                            loged.localStorage = true ;
                            L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage!');
                        }
                        return "" ;
                    }
                }catch (err){
                    if(!loged.localStorage){
                        loged.localStorage = true ;
                        L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                    return "" ;
                }
            },
            removeItem:function (key) {
                try{
                    if(window.localStorage){
                        if(window.localStorage.removeItem){
                            return window.localStorage.removeItem(key);
                        }else{
                            L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage.removeItem , key is '+key+' !');
                            return "" ;
                        }
                    }else{
                        if(!loged.localStorage){
                            loged.localStorage = true ;
                            L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage!');
                        }
                        return "" ;
                    }
                }catch (err){
                    if(!loged.localStorage){
                        loged.localStorage = true ;
                        L.Logger.warning('[tk-fake-sdk]Browser does not support localStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                    return "" ;
                }
            }
        },
        /*会话存储*/
        sessionStorage:{
            setItem:function (key,value) {
                try{
                    if(window.sessionStorage){
                        if(window.sessionStorage.setItem){
                            window.sessionStorage.setItem(key , value);
                        }else{
                            L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage.setItem , key is '+key+' , value is '+value+'!');
                        }
                    }else{
                        if(!loged.sessionStorage){
                            loged.sessionStorage = true ;
                            L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage!');
                        }
                    }
                }catch (err){
                    if(!loged.sessionStorage){
                        loged.sessionStorage = true ;
                        L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                }
            },
            getItem:function (key) {
                try{
                    if(window.sessionStorage){
                        if(window.sessionStorage.getItem){
                            return window.sessionStorage.getItem(key);
                        }else{
                            L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage.getItem , key is '+key+' !');
                            return "" ;
                        }
                    }else{
                        if(!loged.sessionStorage){
                            loged.sessionStorage = true ;
                            L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage!');
                        }
                        return "" ;
                    }
                }catch (err){
                    if(!loged.sessionStorage){
                        loged.sessionStorage = true ;
                        L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                    return "" ;
                }
            },
            removeItem:function (key) {
                try{
                    if(window.sessionStorage){
                        if(window.sessionStorage.removeItem){
                            return window.sessionStorage.removeItem(key);
                        }else{
                            L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage.removeItem , key is '+key+' !');
                            return "" ;
                        }
                    }else{
                        if(!loged.sessionStorage){
                            loged.sessionStorage = true ;
                            L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage!');
                        }
                        return "" ;
                    }
                }catch (err){
                    if(!loged.sessionStorage){
                        loged.sessionStorage = true ;
                        L.Logger.warning('[tk-fake-sdk]Browser does not support sessionStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                    return "" ;
                }
            }
        }
    };
}(L));/*伪装socket.io类*/
var TK = TK || {};
var JsSocket = {} ;

TK.fakeScoketIO = function (room) {
    var that = {};
    var _callbackList = {} , _allbackSeq = 0 , _awitSocketBindEventList = {};

    /*绑定socket事件列表中的等待绑定的事件*/
    that.bindAwitSocketListEvent = function () {
        for(var type in _awitSocketBindEventList){
            var callback =  _awitSocketBindEventList[type] ;
            delete _awitSocketBindEventList[type] ;
            that.on(type , callback);
        }
    }

    /*绑定socket事件
     * @params type:事件的类型 ， String
     * @params callback:事件的回调函数 ,Function
     * */
    that.on = function (type , callback) {
        if(!type){
            L.Logger.error('[tk-fake-sdk]socket bind event name is must exist!');
            return;
        }
        if(!callback){
            L.Logger.error('[tk-fake-sdk]socket bind event callback is must exist!');
            return;
        }
        var _callback = function () {
            var args = [];
            var argumentsJson = {} ;
            for (var i = 0; i < arguments.length; i++) {
                args[i] = typeof  arguments[i] === 'string' ? L.Utils.toJsonParse( arguments[i] ) :  arguments[i] ;
                argumentsJson[i] =  args[i] ;
            }
            L.Logger.debug("[tk-fake-sdk]logMessage info: receive event("+type+") callback arguments json is "+L.Utils.toJsonStringify(argumentsJson) );
            if(TK.global.fakeJsSdkInitInfo.mobileInfo.isSendLogMessageToProtogenesis && TK.SDKNATIVENAME === 'MobileNativeRoom'){
                if(type !== 'printLogMessage' && type !== 'JsSocketCallback'){
                    that.emit('printLogMessage' , L.Utils.toJsonStringify({eventType:type , receiveData:args}) )
                }
            }
            callback.apply(callback ,args );
        }

        switch (TK.SDKNATIVENAME){
            case 'QtNativeClientRoom':
                if(window.qtContentTkClient){
                    try{
                        L.Logger.debug('[tk-fake-sdk]Bind qt event , event name is '+ type);
                        window.qtContentTkClient[type].connect( _callback ) ;
                    }catch (e){
                        L.Logger.error('[tk-fake-sdk]Bind qt event fail , event name is '+ type  , e);
                    }
                }else{
                    L.Logger.warning('[tk-fake-sdk]window.qtContentTkClient is not exist , save event to list awit socket bind , event name is '+ type +' !')
                    _awitSocketBindEventList[type] = _callback ;
                }
                break;
            case 'MobileNativeRoom':
                L.Logger.debug('[tk-fake-sdk]Bind mobile event , event name is '+ type);
                JsSocket[type] = _callback ;
                break;
            default:
                L.Logger.error("[tk-fake-sdk]socket.on:room is not init , sdkNativeName is "+TK.SDKNATIVENAME+"!");
                break ;
        }
    };

    /*触发socket事件
    * @params type:事件的类型 ， String
    * @params params:事件的参数  , Json
    * @params callback:回调函数 ,Function
    * */
    that.emit = function (type , params , callback) {
        if(type === 'printLogMessage' &&  TK.SDKNATIVENAME !== 'MobileNativeRoom' ){
            L.Logger.warning('[tk-fake-sdk]socket.emit event name is printLogMessage , not emit event , because event triggering must be in the mobile app environment.');
            return ;
        }
        var _params = {} ;
        L.Logger.debug("[tk-fake-sdk]socket.emit event name is "+type);
        if( callback && typeof callback === 'function' ){
            var seq = _getCallbackSeq() ;
            _callbackList[seq] = callback ;
            _params.callbackID = seq ;
        }
        if(typeof params === 'object'){
            for(var key in params){
                if(key !== 'callbackID'){
                    _params[key] = params[key] ;
                }
            }
        }else{
            if(typeof params === 'string'){
                var paramsCopy = L.Utils.toJsonParse(params);
                if(typeof paramsCopy === 'object'){
                    for(var key in paramsCopy){
                        if(key !== 'callbackID'){
                            _params[key] = paramsCopy[key] ;
                        }
                    }
                }else{
                   if(_params.callbackID !== undefined){
                       _params['params'] = params ;
                   }else{
                       _params = params ;
                   }
                }
            }else{
                if(_params.callbackID !== undefined){
                    _params['params'] = params ;
                }else{
                    _params = params ;
                }
            }
        }
        switch (TK.SDKNATIVENAME){
            case 'QtNativeClientRoom':
                if(window.qtContentTkClient){
                    if(window.qtContentTkClient['onWeb_'+type]){
                        L.Logger.debug("[tk-fake-sdk]socket.emit:window.qtContentTkClient."+'onWeb_'+type+" has been performed!");
                        if( _params === undefined ){
                            window.qtContentTkClient['onWeb_'+type]("");
                        }else{
                            if(typeof _params === 'object'){
                                _params = L.Utils.toJsonStringify(_params);
                            }
                            window.qtContentTkClient['onWeb_'+type](_params);
                        }
                    }else{
                        L.Logger.error("[tk-fake-sdk]socket.emit:window.qtContentTkClient."+'onWeb_'+type+" is not exist!");
                    }
                }else{
                    L.Logger.error('[tk-fake-sdk]window.qtContentTkClient is not exist!')
                }
                break;
            case 'MobileNativeRoom':
                var clientType = TK.global.fakeJsSdkInitInfo.mobileInfo.clientType ;
                if(clientType === undefined || clientType === null){
                    if(window.JSWhitePadInterface || window.JSVideoWhitePadInterface){
                        clientType =  L.Constant.clientType.android ;
                    }else if(window.webkit && window.webkit.messageHandlers){
                        clientType =  L.Constant.clientType.ios ;
                    }
                }
                switch (clientType){
                    case L.Constant.clientType.ios://ios
                        if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[type] ){
                            L.Logger.debug("[tk-fake-sdk]socket.emit:window.webkit.messageHandlers."+type+".postMessage has been performed!");
                            if( _params === undefined){
                                window.webkit.messageHandlers[type].postMessage({"data":""});
                            }else{
                                //_params = _params || "";
                                if(typeof _params === 'object'){
                                    _params = L.Utils.toJsonStringify(_params);
                                }
                                window.webkit.messageHandlers[type].postMessage({"data":_params});
                            }
                        }else{
                            L.Logger.error("[tk-fake-sdk]socket.emit:window.webkit.messageHandlers."+type+".postMessage is not exist!");
                        }
                        break ;
                    case L.Constant.clientType.android://android
                        if(TK.extendSendInterfaceName === '_videoWhiteboardPage'){
                            if(window.JSVideoWhitePadInterface && window.JSVideoWhitePadInterface[type]){
                                L.Logger.debug("[tk-fake-sdk]socket.emit:window.JSVideoWhitePadInterface."+type+" has been performed!");
                                if( _params === undefined ){
                                    window.JSVideoWhitePadInterface[type]("");
                                }else {
                                    if(typeof _params === 'object'){
                                        _params = L.Utils.toJsonStringify(_params);
                                    }
                                    window.JSVideoWhitePadInterface[type]( _params );
                                }
                            }else{
                                L.Logger.error("[tk-fake-sdk]socket.emit:window.JSVideoWhitePadInterface."+type+" is not exist!");
                            }
                        }else{
                            if(window.JSWhitePadInterface && window.JSWhitePadInterface[type]){
                                L.Logger.debug("[tk-fake-sdk]socket.emit:window.JSWhitePadInterface."+type+" has been performed!");
                                if( _params === undefined ){
                                    window.JSWhitePadInterface[type]("");
                                }else{
                                    if(typeof _params === 'object'){
                                        _params = L.Utils.toJsonStringify(_params);
                                    }
                                    window.JSWhitePadInterface[type]( _params );
                                }
                            }else{
                                L.Logger.error("[tk-fake-sdk]socket.emit:window.JSWhitePadInterface."+type+" is not exist!");
                            }
                        }
                        break;
                    default:
                        L.Logger.error('[tk-fake-sdk]clientType is undefinable , will not be able to execute method '+type+' , clientType is '+clientType);
                        break;
                }
                break;
            default:
                L.Logger.error("[tk-fake-sdk]socket.emit:room is not init , sdkNativeName is "+TK.SDKNATIVENAME+"!");
                break ;
        }
    };

    /*接收回调消息，执行回调函数
    * @params callbackID:回调函数的id , Int
    * @params params:回调函数的参数 ， AllType */
    that.on('JsSocketCallback' , function (callbackID , params) {
        if( _callbackList[callbackID] ){
            if( typeof _callbackList[callbackID] === 'function'){
                _callbackList[callbackID](params);
            }
            delete _callbackList[callbackID] ;
        }
    });

    /*获取回调函数使用的seq*/
    function _getCallbackSeq() {
        return ++_allbackSeq;
    };

    return that ;
};