<!--
 * @Author: your name
 * @Date: 2019-12-02 09:33:16
 * @LastEditTime: 2019-12-02 09:46:14
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \Vote\README.md
 -->

# 微信投票系统

## 实现方式

* 后端：使用nodejs + express + sqlite3 + socket.io
* 前端：使用Vue + element-ui

### 主要功能

* 支持验证码登录，对已注册用户可以使用邮箱找回密码
* 主页面为个人投票主页，支持创建新的投票，对自己创建的投票和投的票的问题进行查看或删除操作
* 投票页面可以实时更新当前投票的状态，也可对已投未过期的票进行实时修改，每个选项点击查看详情可查看投票人的头像

### 实现方法

* 服务器使用express中间件处理各种相关的数据
    1. 配置cors支持跨域访问数据
    2. 使用session存储用户登录的缓存信息，实现持久化操作
    3. 使用multer处理头像图片
    4. 中间件太多就不细说了

* 数据库使用sqlite3进行存储
    1. 数据库表分为：users(个人信息)，votes(创建的投票问题)，optionss(各个问题的选项),voteups(已投过票信息)
    2. 可对每个表进行增删改查操作，返回接口都已完善。

* 前端页面使用Vue全家桶，Vue-cli创建包含vue-router，Vuex
    1. 页面整体采用flex伸缩布局，可根据内容自动调整页面宽高
    2. 页面跳转使用Vue-router实现，使用前端路由切换
