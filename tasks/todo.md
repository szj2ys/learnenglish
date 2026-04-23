# 单词听写小程序前端复刻计划

## 设计系统
- 主色: #58cc02 (绿) / #2b6c00
- 辅色: #2fb8ff (蓝) / #006590
- 强调: #ddad00 (琥珀) / #755b00
- 背景: #fbf9f8
- 风格: Kinetic Studio — 3D 触感按钮、大圆角、无分割线、表面层级区分

## 页面清单
- [x] 全局: app.json / app.js / app.wxss / 自定义 tab-bar
- [x] 首页 (home): 欢迎、每日任务进度、快速开始(5词/10词)、底部导航
- [x] 听写页 (dictation): 进度条、发音按钮、输入框、重播/删除控制
- [x] 结果页 (result): 完成庆祝、正确率、XP、再来一局/复习错题
- [x] 排行榜 (leaderboard): 领奖台(Top3) + 排行列表 + 自己排名浮动卡片
- [x] 个人页 (profile): 头像信息、统计Bento、成就徽章、继续学习
- [x] 编辑资料 (edit-profile): 头像、昵称、用户名、账户安全链接
- [x] 恢复弹窗组件 (resume-modal): 继续上次/重新开始
- [x] 任务页 (quests): 每日任务列表、进度条、奖励

## 验证结果
- [x] app.json pages 与 tabBar 配置完整
- [x] 各页面 WXML/WXSS/JS/JSON 四件套齐全
- [x] 自定义 tab-bar 组件注册 (custom-tab-bar/index.*)
- [x] resume-modal 组件在四件套齐全
- [x] 项目目录结构完整

## 已交付文件
```
app.js / app.json / app.wxss / sitemap.json
custom-tab-bar/index.js .json .wxml .wxss
components/resume-modal/resume-modal.js .json .wxml .wxss
pages/home/home.js .json .wxml .wxss
pages/dictation/dictation.js .json .wxml .wxss
pages/result/result.js .json .wxml .wxss
pages/leaderboard/leaderboard.js .json .wxml .wxss
pages/profile/profile.js .json .wxml .wxss
pages/edit-profile/edit-profile.js .json .wxml .wxss
pages/quests/quests.js .json .wxml .wxss
```

## 交互说明
- 首页 → 听写页 (Continue Learning / Quick Start)
- 听写页 → 结果页 (完成后自动跳转，当前通过按钮模拟)
- 结果页 → 听写页 (Play Again) / 首页 (Close)
- 排行榜 → 底部导航 tab
- 个人页 → 编辑资料 (点击 Hero 区域)
- 任务页 → 底部导航 tab
- 所有 tab 页均有自定义底部导航高亮
