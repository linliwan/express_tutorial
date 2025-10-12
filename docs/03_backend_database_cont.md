[返回首页](../Readme.md)

# 编写createBlog和updateBlogById两个接口函数，涉及数据库事务

## src/db/dbBlog.ts 
- 增加createBlog和updateBlogById两个函数；
- 函数的一次执行涉及多次数据库操作: 例如createBlog涉及插入数据到blogs表和插入数据到blog_tags表；
- 将这些动作放到一个SQL事务中，假如其中某个动作操作失败，则会自动回滚到执行前的状态；

## 错误修正和图片准备
- 由于上一节，测试数据中的image使用的路径是/images，因此要修改public/image文件夹名为images
- 顺带的，将frontend/html_reference目录中的部分图片拷贝到backend/public/images目录中，以待后续使用

## 测试刚刚写好的两个函数

```bash
wesker@wesker-lenovo /d/CODE/bootcamp_ag/init/11_easy_blog/backend (step03)
$ tsx ./src/db/temp_test.ts
{ success: true, message: 'Blog id: 60 updated successfully' }
```
