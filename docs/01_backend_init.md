[返回首页](../Readme.md)

# backend 脚手架搭建步骤

## 首先进入backend目录，初始化npm，并安装必要的依赖

```bash
cd backend

npm init -y
npm install express @types/express ejs @types/ejs
npm install tailwindcss @tailwindcss/cli
npm install sqlite3 sqlite
npm install concurrently

```

## 建立必要的文件及目录
src/index.ts

views/home.ejs

public/css/input.css
public/image/


## 初始的index.ts如下：

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.static('public'));  // 指定静态文件的目录
app.set('view engine', 'ejs');      // 指定模板引擎
app.set('views', 'views');          // 指定视图文件夹 - 存放ejs模板的地方

app.get('/', (req, res) => {
  res.render('home.ejs', { title: 'Home Page' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

```

## 写一个基本的home.ejs
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/output.css">
</head>
<body>
    <h1 class="text-xl text-indigo-600 font-bold"><%= title %></h1>
</body>
</html>

```
## 编辑package.json, 用npm run dev启动项目

## 附录1： 完整的package.json的配置

```json
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"tsx watch ./src/index.ts\" \"npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --watch\"",
    "build" : "tsc",
    "buildcss": "npx @tailwindcss/cli -i ./public/css/input.css -o ./public/css/output.css --minify"
  },
  "type": "module",
  "dependencies": {
    "@tailwindcss/cli": "^4.1.14",
    "@types/ejs": "^3.1.5",
    "@types/express": "^5.0.3",
    "concurrently": "^9.2.1",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "sqlite": "^5.1.1",
    "sqlite3": "^5.1.7",
    "tailwindcss": "^4.1.14"
  }
}


```

## 附录2：tsconfig.json配置

```json
{
    "compilerOptions": {
        "target": "es2020",
        "module": "es2020",
        "rootDir": "./src",
        "outDir": "./dist",
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "rewriteRelativeImportExtensions": true,
        "esModuleInterop": true,
        "strict": true,
        "skipLibCheck": true
    }
}

```

## 附录3：检查已经全局安装的npm模块

```bash
$ npm list -g
C:\Users\wesker\AppData\Roaming\npm
├── corepack@0.34.0
├── nodemon@3.1.10
├── tsx@4.20.6
└── typescript@5.9.2

```


