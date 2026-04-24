# 单词听写小程序 - 后端开发与前后端联调

## 云函数开发（10个）- 全部完成
- [x] login - 微信登录，创建/更新用户
- [x] getUserInfo - 获取用户信息
- [x] getUserStats - 获取用户统计（streak, xp, level, daily progress等）
- [x] updateProfile - 更新用户资料
- [x] getDailyWords - 获取每日单词列表（含内置词库）
- [x] startSession - 开始听写会话
- [x] submitAnswer - 提交答案
- [x] completeSession - 完成会话，更新用户统计和每日进度
- [x] getResumeSession - 获取可恢复的会话
- [x] getLeaderboard - 获取排行榜

## 数据库集合设计
- users - 用户信息（openid, nickName, streak, xp, level, achievements等）
- words - 单词库（内置20个种子单词，可扩展）
- sessions - 听写会话（wordIds, currentIndex, answers, status等）
- mistakes - 错题本（word, count, nextReview）
- dailyProgress - 每日进度（date, completed, correct）

## 前端联调 - 全部完成
- [x] app.js - 全局登录（wx.cloud.init + login 云函数）
- [x] home/home.js - getUserStats + getResumeSession
- [x] dictation/dictation.js - getDailyWords + startSession + submitAnswer + completeSession
- [x] result/result.js - 接收 dictation 页参数并展示
- [x] leaderboard/leaderboard.js - getLeaderboard
- [x] profile/profile.js - getUserInfo
- [x] edit-profile/edit-profile.js - updateProfile

## 联调要点
1. app.js 在 onLaunch 时调用 login 云函数，获取 openid 和用户信息
2. home 页同时获取用户统计和未完成的会话，支持继续学习
3. dictation 页支持两种入口：新会话（loadWords）和恢复会话（resumeSession）
4. dictation 页输入支持自动提交（空格触发）和虚拟键盘
5. result 页通过 URL 参数接收会话结果
6. profile 页在 onShow 时刷新，编辑后更新全局数据

## 注意事项
- 云函数需要在微信开发者工具中上传部署后才能使用
- 数据库集合会自动创建（第一次写入时）
- 单词词库使用内置种子数据，也可通过管理后台批量导入
