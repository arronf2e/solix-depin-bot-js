const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');
const axios = require('axios');
const { getDomains, randomEmail } = require('./generateEmail.js');
const config = require('./config.json');

// 替换成你的yescaptcha.com的clientKey： https://yescaptcha.com/i/ZWHtlc，打码费用 0.016R/次
const clientKey = config.clientKey || "";
const inviteCode = config.inviteCode || 'zQXIGFlF';

// 固定，不要动
const websiteKey = '0x4AAAAAABD9Dqblkacz6ou7'

// 固定，不要动
const websiteURL = 'https://dashboard.solixdepin.net/sign-up?ref=zQXIGFlF'


// 新增post方法
async function post(url, data, headers = {}) {
  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('请求失败:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// 新增createTask方法
async function createTask() {
  const yesCaptchaUrl = 'https://api.yescaptcha.com/createTask';
  const taskData = {
    task: {
      type: 'TurnstileTaskProxyless',
      websiteURL,
      websiteKey,
    },
    clientKey,
  };

  console.log(taskData, 'taskData')
  
  return await post(yesCaptchaUrl, taskData, {
    'Content-Type': 'application/json'
  });
}

async function getTaskResult(taskId) {
  const yesCaptchaUrl = 'https://api.yescaptcha.com/getTaskResult';
  const taskData = {
    taskId,
    clientKey,
  };
  
  return new Promise(async (resolve, reject) => {
    const checkResult = async () => {
      try {
        const res = await post(yesCaptchaUrl, taskData, {
          'Content-Type': 'application/json'
        });
        
        if (res.status === 'ready') {
          resolve(res);
        } else {
          console.log(`任务状态: ${res.status}, 3秒后重试...`);
          setTimeout(checkResult, 3000);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    await checkResult();
  });
}


async function registerAccount(captchaToken, referralCode = 'zQXIGFlF', email, password) {
  try {
    const response = await axios.post(
      'https://api.solixdepin.net/api/auth/register',
      {
        email,
        password,
        captchaToken,
        referralCode
      },
      {
        headers: {
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9',
          'content-type': 'application/json',
          'origin': 'https://dashboard.solixdepin.net',
          'priority': 'u=1, i',
          'referer': 'https://dashboard.solixdepin.net/',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
        }
      }
    );
    
    console.log('注册成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('注册失败:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function main() {
  // 处理临时邮箱
  const domains = await getDomains();
  const selectedDomain = domains[Math.floor(Math.random() * domains.length)];
  const randEmail = randomEmail(selectedDomain);
  const randomPassword = faker.internet.password({
    length: 12,
    memorable: false,
    pattern: /[A-Za-z0-9!@#$%^&*()]/
  });
  console.log('随机邮箱:', randEmail.email, '随机密码:', randomPassword);
  try {
    // 创建任务
    const taskResponse = await createTask();
    if(!taskResponse.errorId) {
      console.log('打码任务创建成功:', taskResponse.taskId);
      const res = await getTaskResult(taskResponse.taskId);
      console.log('打码任务结果:', res);
      await registerAccount(res.solution.token, inviteCode, randEmail.email, randomPassword); // 调用注册方法并传入验证码和邮箱
      // 新增：将账号密码写入accounts.txt
      const accountLine = `${randEmail.email}:${randomPassword}\n`;
      fs.appendFileSync(path.join(__dirname, 'accounts.txt'), accountLine, {flag: 'a'});
      console.log(`账号已保存到accounts.txt: ${randEmail.email}`);
    }
  } catch (error) {
    console.error('打码任务创建失败:', error);
  }
}

main();
