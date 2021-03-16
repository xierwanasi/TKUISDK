//
//  HWSubtitleView.h
//  DecodeSubtitleView
//
//  Created by weshow on 2019/7/5.
//  Copyright © 2019年 weshow. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TKIJKMediaFramework/IJKMediaFramework.h"
NS_ASSUME_NONNULL_BEGIN

@interface IJKSubtitleView : UIView
@property (nonatomic, assign) id<IJKMediaPlayback>play;
/// 字幕偏移时间
@property (nonatomic, assign) float changeTime;

- (instancetype)initWithFrame:(CGRect)frame;

/**
 链接视频播放器.必填否则无效

 @param play IJKMediaPlayback
 */
- (void)setPlay:(id<IJKMediaPlayback> _Nonnull)play;

/**
 配置你视频的字幕文件路径

 @param contenPath NSString
 */
- (void)configurationSubtitleViewWithContenPath:(NSString *)contenPath;

/**
 视频关闭的时候要调用该方法注销字幕.否则会内存泄漏
 */
- (void)destroySubtitle;
@end

NS_ASSUME_NONNULL_END
