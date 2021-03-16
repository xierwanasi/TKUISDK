//
//  TKPlugInDelegate.h
//  TKUISDK
//
//  Created by Yi on 2020/11/5.
//  Copyright © 2020 Yi. All rights reserved.
//

#ifndef TKPlugInDelegate_h
#define TKPlugInDelegate_h


// 分享
@protocol TKShareDelegate <NSObject>

@required
- (void) showSharePlatformWithShareDict:(NSDictionary *)shareDict image:(UIImage *)image;
- (BOOL) isInstallPlatform;

@end

//// 美颜
//@protocol TKBeautyDelegate <NSObject>
//
//
//
//@end
//
//// 直播
//@protocol TKLiveDelegate <NSObject>
//
//
//
//@end
#endif /* TKPlugInDelegate_h */
