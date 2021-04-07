//
//  TKAPPSetConfig.h
//  EduClass
//
//  Created by maqihan on 2018/11/30.
//  Copyright © 2018 talkcloud. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TKPluginDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface TKAPPSetConfig : NSObject

+ (instancetype)shareInstance;

/**
  设置 登录页为 rootviewcontroller
*/
- (void) setLoginViewForRootViewController:(UIWindow *) window;

/**
  初始化 主题 崩溃上报  更新
  @param buglyId  (传@""  默认使用拓课云bugly账户)
*/
- (void)setupAPPWithBuglyID:(NSString *)buglyId;

/**
  是否隐藏设备检测页(默认显示)
  YES 隐藏
  NO 显示
*/
- (void)isHiddenDeviceCheckView:(BOOL)isHidden;

/**
  检查更新
*/
- (void)checkForUpdate;

/**
  腾讯COS
*/
- (void)setupCOS;

/**
  加载后台配置的loading gif图
  @param key 企业的authKey (key传空的话 加载默认的loading)
*/
- (void)roomLoadingImageWithKey:(NSString *)key;


// MARK: - 插件
- (void)registerSharePlusin:(id<TKShareDelegate>)delegate;
//- (void)registerBeautyPlusin:(id<TKBeautyDelegate>)delegate;
//- (void)registerLivePlusin:(id<TKLiveDelegate>)delegate;

@end

NS_ASSUME_NONNULL_END
