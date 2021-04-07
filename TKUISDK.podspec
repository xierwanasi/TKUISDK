#
# Be sure to run `pod lib lint TKUISDK_iOS.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'TKUISDK_iOS'
  s.version          = '4.2.6'
  s.summary          = 'A short description of TKUISDK_iOS.'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/tksdk@talk-cloud.com/TKUISDK_iOS'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'tksdk@talk-cloud.com' => 'xlangzhao@sina.com' }
  s.source           = { :git => 'https://github.com/Talk-Cloud/TKUISDK_iOS.git', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '9.0'

  # s.source_files = 'TKUISDK_iOS/Classes/**/*'
  
  s.ios.vendored_frameworks = 'TKUISDK_iOS/Frameworks/*.framework'
  s.resources = ['TKUISDK_iOS/Bundles/*.bundle']
  s.static_framework = true
  
  
  # s.resource_bundles = {
  #   'TKUISDK_iOS' => ['TKUISDK_iOS/Assets/*.png']
  # }

  # s.public_header_files = 'Pod/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  # s.dependency 'AFNetworking', '~> 2.3'
  
  
  s.pod_target_xcconfig = { 'VALID_ARCHS' => 'x86_64 armv7 arm64 arm64e' }
  
  s.dependency 'SSZipArchive', '2.1.3'
  s.dependency 'Masonry', '1.1.0'
  s.dependency 'SakuraKit', '1.0.0'
  s.dependency 'Bugly', '2.5.0'
  s.dependency 'MJRefresh', '3.4.3'
  s.dependency 'UMCCommon', '7.2.5'
  
end