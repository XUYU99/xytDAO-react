# xytDAO-react
在openzeppelin基础上拓展的DAO，结合了react界面
### 一、目录介绍

#### 1、合约

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ce2aea92694b424db169dcbb627aac4d.png#pic_center =300x)


#### 2、脚本和前端页面

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5e602357d7c8464baed0ffd98b95bf80.png#pic_center =300x)


#### 3、前端页面样式

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7b46383b35e74268ba367e1a8eec8040.png#pic_center =300x)


### 二、前端页面

#### 1、home页面

右上角connect ：连接钱包
mint 按钮：进入mint 自定义token页面
join按钮：进入xytDAO 页面
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3e72c48c4d0d40dc8a6a8cacb61d32a5.png#pic_center =600x)


#### 2、mint 页面

输入自定义token的 name和symbol
点击Init deploy token Contract 即可生成属于自己的token，初始化会mint 100个币
mint 按钮：可以额外挖币
verify 按钮：可以查看是否部署成功，totalSupply有多少
![](https://i-blog.csdnimg.cn/direct/616505287d05436ebe0eb390becf2611.png#pic_center =600x)


#### 4、Dao页面

左边是所有提出的提案列表：会显示提出时间、提案描述、提案id、支持比例和交易hash
deploy 按钮：dao的部署和初始化设置，例如权限、提案持续时间、投票最低阈值等
propose 按钮：输入 提案选定执行的合约、value和提案描述，点击propose后，提案发送成功后会显示在左边提案列表
vote 按钮：输入 要投票的提案id、支持选项(0: 反对, 1: 支持, 2: 弃权)，点击vote会进行投票，投票成功后会更新左边的提案列表投票数据
execute 按钮：输入 要执行的提案id，当其提案的投票达到时间并且支持大于反对，点击execute就会执行当初发起提案所设定的执行合约函数
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/44261cbe6eda4121830fadb2fcdb014e.png#pic_center =600x)


### 三、运行流程

```bash
打开一个终端，输入：
yarn hardhat node
打开另一个终端，输入：
yarn start
打开页面，输入网址：http://localhost:3000/
```
csdn博客详情
https://editor.csdn.net/md/?articleId=143822690
