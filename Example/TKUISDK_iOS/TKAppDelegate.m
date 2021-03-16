//
//  TKAppDelegate.m
//  TKUISDK_iOS
//
//  Created by tksdk@talk-cloud.com on 03/09/2021.
//  Copyright (c) 2021 tksdk@talk-cloud.com. All rights reserved.
//

#import "TKAppDelegate.h"

#import <TKUISDK/TKUISDK.h>
#import "TKUMShareSettings.h"

@implementation TKAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    
    // 使用拓课云登录界面
//    [[TKAPPSetConfig shareInstance] setLoginViewForRootViewController:self.window];

    // 初始化 bugly 崩溃收集
    [[TKAPPSetConfig shareInstance] setupAPPWithBuglyID:@""];

    // 加载自定义GIF图
    [[TKAPPSetConfig shareInstance] roomLoadingImageWithKey:@""];
    return YES;
}


#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 90000
-(BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options{
    
    [[TKEduClassManager shareInstance] joinRoomWithUrl:url.relativeString];
    return YES;
}

#else

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(nullable NSString *)sourceApplication annotation:(id)annotation{
    
    return YES;
}

#endif


- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    [[TKEduClassManager shareInstance] leaveRoom];
}


- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    [[TKEduClassManager shareInstance] applicationDidBecomeActive];
}

@end
