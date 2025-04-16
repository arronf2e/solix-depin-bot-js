# 🌀 Solix DePIN 自动化脚本 JS版
- 使用这个强大的Node.js脚本自动化Solix浏览器挖矿<br>
<img src="https://github.com/user-attachments/assets/05062ed3-e3b6-4e4b-82a6-8a99b541633d" widht=580 height=480 >
<br>

>[!TIP]
> 您可能会遇到502、503等服务器错误<br>
> 目前仍处于FOMO阶段，相信您能理解<br>

> [!WARNING]
> 使用本脚本风险自担。对于因使用本脚本导致的任何损失或后果，本人概不负责。

## 🦾 脚本功能

- 多账号支持
- 自动挖矿
- 自动完成任务
- Bearer Token过期时自动重新登录
- 运行脚本时自动检测Bearer Token

## 🔓 注册指南

- 如果您还没有Solix DePIN账号
- 请在此注册 [https://dashboard.solixdepin.net/sign-up](https://dashboard.solixdepin.net/sign-up?ref=zQXIGFlF)
- 邀请码 = `zQXIGFlF`
  ```bash
  zQXIGFlF
  ```

## 🤔 如何使用

- Clone This Repo
  - ```bash
    git clone https://github.com/arronf2e/solix-depin-bot-js.git
    ```
- Go To Folder
  - ```bash
    cd solix-depin-bot-js
    ```

## ⚙️ 配置

- 将您的账号信息(邮箱:密码)添加到accounts.txt文件
- 将代理信息添加到proxy.txt文件
- 新建 config.json 文件
  ```json
  {
    "clientKey": "", 
    "inviteCode": "zQXIGFlF"
  }
- clientKey替换成你的yescaptcha.com的clientKey： https://yescaptcha.com/i/ZWHtlc，打码费用 0.016R/次

- 安装依赖
  ```bash
  npm install
  ```
- 运行脚本

  ```bash
  npm start
  ```

- 刷邀请

  ```bash
  node register.js
  ```
