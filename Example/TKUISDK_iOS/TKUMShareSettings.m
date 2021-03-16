//
//  TKUMShareSettings.m
//  EduClass
//
//  Created by talkcloud on 2020/8/25.
//  Copyright © 2020 talkcloud. All rights reserved.
//

#import "TKUMShareSettings.h"
//#import <UMShare/UMShare.h>

#define TK_WX_AppKey @""
#define TK_WX_Secret @""

#define TK_universal_Link @""

@interface TKUMShareSettings ()


@end

@implementation TKUMShareSettings

+ (void) UMShareSettings {
    
    // U-Share 平台设置
        [self confitUShareSettings];
        
        [self configUSharePlatformsWechatAppKey:TK_WX_AppKey appSecret:TK_WX_Secret];
    //    [self configUSharePlatformsQQAppKey:@"" appSecret:@""];
    //    [self configUSharePlatformsSinaAppKey:@"" appSecret:@"" redirectURL:@""];
}

+ (void)confitUShareSettings
{
    //微信和QQ完整版会校验合法的universalLink，不设置会在初始化平台失败
//    [UMSocialGlobal shareInstance].universalLinkDic =
//        @{@(UMSocialPlatformType_WechatSession):TK_universal_Link,
//          @(UMSocialPlatformType_WechatTimeLine):TK_universal_Link,
//          @(UMSocialPlatformType_Qzone):TK_universal_Link,
//          @(UMSocialPlatformType_QQ):TK_universal_Link};
    
//    [UMSocialGlobal shareInstance].universalLinkDic =
//    @{@(UMSocialPlatformType_WechatSession):TK_universal_Link,
//      @(UMSocialPlatformType_WechatTimeLine):TK_universal_Link};
}

+ (void)configUSharePlatformsWechatAppKey:(NSString *)appKey appSecret:(NSString *)appSecret
{
    /* 设置微信的appKey和appSecret */
//    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession appKey:appKey appSecret:appSecret redirectURL:@"http://mobile.umeng.com/social"];
//
//    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatTimeLine appKey:appKey appSecret:appSecret redirectURL:@"http://mobile.umeng.com/social"];
}

+ (void)configUSharePlatformsQQAppKey:(NSString *)appKey appSecret:(NSString *)appSecret {
    
//    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_QQ appKey:@"1105821097"/*设置QQ平台的appID*/  appSecret:nil redirectURL:@"http://mobile.umeng.com/social"];
//
//    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Qzone appKey:@"1105821097"/*设置QQ平台的appID*/  appSecret:nil redirectURL:@"http://mobile.umeng.com/social"];
}

+ (void)configUSharePlatformsSinaAppKey:(NSString *)appKey appSecret:(NSString *)appSecret redirectURL:(NSString *)redirectURL {
    
    /* 设置新浪的appKey和appSecret */
//    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Sina appKey:@"3921700954"  appSecret:@"04b48b094faeb16683c32669824ebdad" redirectURL:@"https://sns.whalecloud.com/sina2/callback"];
}

@end
