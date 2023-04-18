// 使用 Node.js 的 fs 模块示例
const fs = require("fs");
const path = require("path");

const pagesFolderPath = path.join(__dirname, "../src/pages"); // 替换为实际的文件夹路径

fs.readdir(pagesFolderPath, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    const subFolders = files.filter((file) =>
      fs.statSync(path.join(pagesFolderPath, file)).isDirectory()
    );
    // 将 JSON 数据序列化为字符串
    const jsonStr = JSON.stringify(subFolders, null, 2); // 第二个参数是缩进空格数，用于格式化输出
    const filePath = `${process.cwd()}/config/pagesFolder.js`; // 文件路径, process.cwd() 相当于项目根目录
    const fileContent = `window.pagesFolder = ${jsonStr};\n`; // 将获取的文件夹信息变量赋值到window对象
    fs.writeFileSync(filePath, fileContent, "utf-8"); // 写入文件(没有则自动创建)
    console.log('Pages Created!~');
  }
});
