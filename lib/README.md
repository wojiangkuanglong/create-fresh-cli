# create-fresh-cli

## 使用方式

```bash
npm init fresh@latest
```

```bash
yarn create fresh@latest
```

```bash
pnpm create fresh@latest
```

在交互模式下 cli 会问你几个问题, 然后为你创建一个新项目，但你也可以通过几个标记跳过交互模式

要跳过交互模式，可以使用 `--yes` 标志
例如 创建一个名称为 my-project 的 react 项目，不需要包含.vscode 文件，使用 pnpm 作为包管理器

```bash
pnpm create fresh@latest -- --name my-project --kit react --flavor application --yes --vscode false --pm pnpm
```

## 模板列表

| Name  | Description    | Repository                                                              |
| ----- | -------------- | ----------------------------------------------------------------------- |
| react | react 项目模板 | https://github.com/wojiangkuanglong/react-fresh-starter        |
| vue   | vue 项目模板   |  |
| node  | node 项目模板  |        |
| npm   | npm 模板       |   |

## cli 参数

| 参数       | 描述                               | 默认        |
| ---------- | ---------------------------------- | ----------- |
| `--name`   | 项目名称                           | `undefined` |
| `--kit`    | 项目模板类型 react、vue、node、npm | `undefined` |
| `--flavor` | 项目类型 application、 library     | `false`     |
| `--yes`    | 是否跳过交互模式                   | `false`     |
| `--git`    | 是否初始化 git 仓库                | `true`      |
| `--vscode` | 是否包含 .vscode 文件              | `true`      |
| `--pm`     | 包管理器 npm、yarn、pnpm           | `npm`       |
