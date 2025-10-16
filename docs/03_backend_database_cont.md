[返回首页](../Readme.md)

# 编写createBlog和updateBlogById两个接口函数，涉及数据库事务

## src/db/dbBlog.ts 
- 增加createBlog和updateBlogById两个函数；
- 函数的一次执行涉及多次数据库操作: 例如createBlog涉及插入数据到blogs表和插入数据到blog_tags表；
- 将这些动作放到一个SQL事务中，假如其中某个动作操作失败，则会自动回滚到执行前的状态；

## 事务（Transaction） 是数据库操作中的一个逻辑单元，它由一组要么全部执行成功、要么全部失败回滚的操作组成
- 简单来说：“事务让你把多个 SQL 操作当成一个整体，要么全做，要么全不做。”
- 比如在createBlog的例子中：
```sql
INSERT INTO blogs ...
INSERT INTO blog_tags ...
```
- 这两个操作必须保持一致性：如果 blog 插入成功，但 tag 插入失败，就不能留下一条“孤立”的 blog 记录。因此，我们用事务来保证：两个操作要么都成功，要么都撤销。

## 事务解决的是 数据一致性 问题
```sql
-- 举个现实例子👇
-- 假设你在银行系统中执行两步操作：
-- 从账户 A 扣 100 元
-- 给账户 B 加 100 元

-- 如果第一步成功但第二步失败，系统钱就“丢”了。
-- 为避免这种情况，我们必须：
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT;

-- 如果第二步失败：
ROLLBACK;
-- 两边都恢复原状
```
- 在开发中，事务常用于：多表写入（这里的createUser案例）、库存扣减（扣库存 + 写订单，必须同步）、金融转账（两个账户资金必须同时变化）、日志一致性（主操作成功后写日志，否则全部回滚）


## 图片准备
- 由于SQL测试数据中的image使用的路径是类似“/images/a5.avif”这样的，因此在public下新建images文件夹；
- 顺带的，将frontend/html_reference目录中的部分图片拷贝到backend/public/images目录中，以待后续使用

## 测试刚刚写好的两个函数

```bash
wesker@wesker-lenovo /d/CODE/bootcamp_ag/init/11_easy_blog/backend (step03)
$ tsx ./src/db/temp_test.ts   # 或者 npm run test
{ success: true, message: 'Blog id: 60 updated successfully' }
```
