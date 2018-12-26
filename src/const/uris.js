const uris = {
    // 获取平台信息
    authInfo: '/auth/info/omw',
    // 获取验证码
    authCaptcha: '/auth/captcha/omw',
    // 用户登录
    authLogin: '/auth/login/omw',
    // 获取用户信息
    authAccount: '/omw.api/login/user/info',
    // 退出登录
    authLogout: '/omw.api/logout',
    // 通知订阅
    notifySubscribe: '/omw.api/notify/subscribe',

    // 系统信息
    // 获取主机信息
    sysHostInfo: '/omw.api/sys/host/info',
    // 获取网卡信息
    sysNetworkInterfaceList: '/omw.api/sys/network/interface/list',
    // 获取监听端口
    sysListenPortList: '/omw.api/sys/network/listen/port/list',

    // 服务
    // 获取服务状态
    svcStatus: '/omw.api/svc/status',
    // 启动服务
    svcStart: '/omw.api/svc/start',
    // 停止服务
    svcStop: '/omw.api/svc/stop',
    // 重启服务
    svcRestart: '/omw.api/svc/restart',

    // 后台服务
    // 获取服务信息
    svcOmwInfo: '/omw.api/svc/omw/info',
    // 是否可在线重启
    svcOmwRestartEnable: '/omw.api/svc/omw/restart/enable',
    // 重启服务
    svcOmwRestart: '/omw.api/svc/omw/restart',
    // 是否可在线更新
    svcOmwUpdateEnable: '/omw.api/svc/omw/update/enable',
    // 上传并更新服务
    svcOmwUpdate: '/omw.api/svc/omw/update',

    // 其它服务
    // 获取服务列表
    svcOtherList: '/omw.api/svc/other/list',
    // 上传并更新服务
    svcOtherUpdate: '/omw.api/svc/other/update',

    // tomcat服务
    // 获取服务列表
    svcTomcatList: '/omw.api/svc/tomcat/list',
    // 获取应用程序列表
    svcTomcatAppList: '/omw.api/svc/tomcat/app/list',
    // 上传应用
    svcTomcatAppUpload: '/omw.api/svc/tomcat/app/upload',
    // 删除应用
    svcTomcatAppDelete: '/omw.api/svc/tomcat/app/delete',

    // jar服务
    // 获取配置信息
    svcJarCfg: '/omw.api/svc/jar/cfg',
    // 上传服务
    svcJarUpload: '/omw.api/svc/jar/upload',
    // 获取服务列表
    svcJarList: '/omw.api/svc/jar/list',
    // 获取服务信息
    svcJarInfo: '/omw.api/svc/jar/info',
    // 卸载服务
    svcJarUninstall: '/omw.api/svc/jar/uninstall',

    // 转发服务
    // 获取服务配置信息
    proxyCfgServerInfo: '/omw.api/proxy/cfg/server/info',
    // 设置服务配置信息
    proxyCfgServerUpdate: '/omw.api/proxy/cfg/server/update',
    // 获取http转发列表
    proxyCfgHttpInfo: '/omw.api/proxy/cfg/http/info',
    // 添加http转发条目
    proxyCfgHttpAdd: '/omw.api/proxy/cfg/http/add',
    // 删除http转发条目
    proxyCfgHttpDelete: '/omw.api/proxy/cfg/http/delete',
    // 修改http转发条目
    proxyCfgHttpModify: '/omw.api/proxy/cfg/http/modify',
    // 获取https转发列表
    proxyCfgHttpsInfo: '/omw.api/proxy/cfg/https/info',
    // 添加https转发条目
    proxyCfgHttpsAdd: '/omw.api/proxy/cfg/https/add',
    // 删除https转发条目
    proxyCfgHttpsDelete: '/omw.api/proxy/cfg/https/delete',
    // 修改https转发条目
    proxyCfgHttpsModify: '/omw.api/proxy/cfg/https/modify',
    // 获取转发服务状态
    proxySvcStatus: '/omw.api/proxy/svc/status',
    // 启动转发服务
    proxySvcStart: '/omw.api/proxy/svc/start',
    // 停止转发服务
    proxySvcStop: '/omw.api/proxy/svc/stop',
    // 重启转发服务
    proxySvcRestart: '/omw.api/proxy/svc/restart',

    // 网站管理
    // 获取管理网站信息
    siteOmwInfo: '/omw.api/site/omw/info',
    // 获取管理网站设置信息
    siteOmwSetting: '/omw.api/site/omw/setting',
    // 上传管理网站
    siteOmwUpload: '/omw.api/site/omw/upload',
}

export default {
    uris
}