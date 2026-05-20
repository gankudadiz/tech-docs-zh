---
title: 隐藏字段
---

## 简介

隐藏组件允许你在表单中创建一个持有值的隐藏字段。

```php
use Filament\Forms\Components\Hidden;

Hidden::make('token')
```

请注意，如果用户决定使用浏览器的开发者工具，此字段的值仍然可以被编辑。你不应该使用此组件来存储敏感或只读信息。
