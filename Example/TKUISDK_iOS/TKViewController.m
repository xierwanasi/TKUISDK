//
//  TKViewController.m
//  TKUISDK_iOS
//
//  Created by tksdk@talk-cloud.com on 03/09/2021.
//  Copyright (c) 2021 tksdk@talk-cloud.com. All rights reserved.
//

#import "TKViewController.h"
#import <TKUISDK/TKUISDK.h>
#import <TKRoomSDK/TKRoomSDK.h>

@interface TKViewController ()
@property (weak, nonatomic) IBOutlet UITextField *roomID;
@property (weak, nonatomic) IBOutlet UITextField *pwd;

@property (weak, nonatomic) IBOutlet UITextField *roleNum;

@property (weak, nonatomic) IBOutlet UISwitch *switchServer;
@end

@implementation TKViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
}

- (IBAction)loginAction:(id)sender {
    

  
#pragma mark - 回放
//    NSDictionary *param = @{
//        // 房间号
//        @"serial" : @"579983144",
//        // 客户端类型 iOS = 3
//        @"clientType" : @3,
//        // 地址
//        @"host" : @"global.talk-cloud.net",
//        // 回放路径
//        @"path" :
//            @"global.talk-cloud.net:8081/f99f5b46-db79-4656-98be-76154057357b-579983144/",
//        // 回放字段
//        @"playback": @1,
//        // 房间类型 小班 0   大班 3
//        @"type":@3,
//
//        @"recordtitle":@"1602843277005"
//    };
//    [[TKEduClassManager shareInstance] joinPlaybackRoomWithParamDic:param
//                                                     ViewController:self
//                                                           Delegate:self
//                                                          isFromWeb:NO];
//

    // 回放 MP4
//    [[TKEduClassManager shareInstance] joinRoomWithPlaybackPath:@"https://recordcdn.talk-cloud.net/3426dae1-5bc4-4de7-9a7e-4e03a16b18c0-82218266/record.mp4" ViewController:self];
//
//        return;
#pragma mark - 通过链接进入
    
//    NSString *url = @"enterroomnew://replay?host=cna.talk-cloud.net&domain=bjmlk&serial=1119310518&type=3&path=global.talk-cloud.net:8081/6495e27f-d2f9-47d9-8f25-998df19e8d8f-1119310518/&tplId=beyond&skinId=beyond_default&skinResource=&colourid=purple&layout=1&companyidentify=1";
//
//    [[TKEduClassManager shareInstance] joinRoomWithUrl:url];
    

#pragma mark - 直播

    NSDictionary *param = @ {
        // 房间号
        @"serial":@"1220779017",
        // 密码
        @"password": @(1),
        // 用户角色 老师(0) 助教(1) 学生(2)
        @"userrole": @(0),
        // 用户昵称
        @"nickname": @"BBQ",
        // 地址
        @"host": @"global.talk-cloud.net",
        // 主机
        @"server": @"global",
        // 端口号
        @"port": @"443",
        // 客户端类型 iOS = 3
        @"clientType": @"3",

        /*
         用户ID,可选字段(不可传空字符),如果不传，SDK 会自动生成用户唯一ID
         注意:教室内唯一ID , 多个相同ID 会互踢.
         */
//        @"userid":@"abc123",
    };
    [[TKEduClassManager shareInstance] joinRoomWithParamDic:param
                                             ViewController:self
                                                   Delegate:nil
                                                  isFromWeb:NO];
 
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [self.view resignFirstResponder];
}

#pragma mark - TKEduRoomDelegate
/**
 进入房间失败
 
 @param result 错误码 详情看 TKRoomSDK -> TKRoomDefines ->TKRoomErrorCode 结构体
 
 @param desc 失败的原因描述
 */
- (void)onEnterRoomFailed:(int)result Description:(NSString*)desc
{
    
}

/**
 被踢回调

 @param reason 1:被老师踢出 400：重复登录
 */
- (void)onKitout:(int)reason
{
    
}

/**
 进入课堂成功后的回调
 */
- (void)joinRoomComplete
{
    
}

/**
 离开课堂成功后的回调
 */
- (void)leftRoomComplete
{
    
}

/**
 课堂开始的回调
 */
- (void)onClassBegin
{
    
}

/**
 课堂结束的回调
 */
- (void)onClassDismiss
{
    
}

/**
 摄像头打开失败回调
 */
- (void)onCameraDidOpenError
{
    
}

/**
 课堂页面消失的回调
 */
- (void)onClassRoomDisappear {
    
    
}
@end
