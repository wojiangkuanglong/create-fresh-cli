import { intro, outro, text, select, confirm, spinner, note, cancel } from '@clack/prompts';
import { green } from 'kleur';
import { setTimeout } from 'node:timers/promises';
import path from 'path';
import parser from 'yargs-parser';

import { AVAILABLE_KITS, AVAILABLE_LIBRARIES } from './constants';
import { PackageManagers } from './types';
import {
  handleCancelation,
  getKitFromGitHub,
  initGitRepo as initializeGit,
  initNodeProject,
  removeFolder,
  removeFile,
  getPmInstallCommands,
} from './utils';

const ALL_KITS = [...AVAILABLE_KITS, ...AVAILABLE_LIBRARIES];

export async function main() {
  const cleanArgv = process.argv.filter((arg) => arg !== '--');
  const args = parser(cleanArgv, {
    string: ['name', 'kit', 'pm'], // --pm 为包管理器
    boolean: ['git', 'yes', 'vscode'],
    default: {
      git: true,
    },
  });

  intro(`欢迎来到 CREATE FRESH CLI`);

  const projectName = args?.name
    ? args.name
    : await text({
        message: '请输入项目名称',
        initialValue: '',
        placeholder: '例如: my-awesome-project',
        validate(value) {
          if (value.length === 0) {
            return `项目名称不能为空!`;
          }
        },
      });

  handleCancelation(projectName);

  const flavor = args.flavor
    ? args.flavor
    : await select({
        message: '请输入项目类型',
        options: [
          {
            value: 'application',
            label: '创建一个项目 (例如: React项目、Vue项目、Node项目)',
          },
          {
            value: 'library',
            label: '创建一个包 (例如: npm包)',
          },
        ],
      });

  const kit = args.kit
    ? args.kit
    : await select({
        message: '请选择模板',
        options: flavor === 'application' ? AVAILABLE_KITS : AVAILABLE_LIBRARIES,
      });

  handleCancelation(kit);

  const initGitRepo =
    'git' in args
      ? args.git
      : await confirm({
          message: '是否初始化 git 仓库？',
          initialValue: false,
        });

  handleCancelation(initGitRepo);

  const useVscode =
    'vscode' in args
      ? args.vscode
      : await confirm({
          message: '是否需要包含 .vscode 文件夹？ （如果你使用vscode，推荐）',
          initialValue: true,
        });

  handleCancelation(useVscode);

  const packageManager: PackageManagers = args.pm
    ? args.pm
    : await select({
        message: '请选择包管理器',
        options: [
          {
            value: 'npm',
            label: 'npm',
            hint: '默认包管理器',
          },
          {
            value: 'yarn',
            label: 'yarn',
          },
          {
            value: 'pnpm',
            label: 'pnpm',
          },
        ],
      });

  // 如果用户取消选择包管理器，默认使用 npm。
  handleCancelation(packageManager);

  const install =
    'yes' in args
      ? args.yes
      : await confirm({
          message: '是否继续?',
          initialValue: true,
        });

  handleCancelation(install);

  if (install) {
    const s = spinner();
    const destPath = path.join(process.cwd(), projectName as string);
    const packageJsonPath = path.join(destPath, 'package.json');
    s.start('开始启动... ⏳');
    const github = ALL_KITS.find((item) => item.label === kit);
    await getKitFromGitHub(github ? github.value : kit, projectName as string);
    await initNodeProject(packageJsonPath, destPath, projectName as string);
    s.stop('完成 ✅');
  } else {
    cancel('Ok, 安装取消。再见! 🤗');
    process.exit(1);
  }

  if (!useVscode) {
    const destPath = path.join(process.cwd(), projectName as string);
    await removeFolder('.vscode', destPath);
  }

  if (initGitRepo) {
    const projectFolder = path.join(process.cwd(), projectName as string);
    try {
      await initializeGit(projectFolder);
    } catch (error: unknown) {
      cancel(`git 初始化失败`);
      process.exit(1);
    }
  }

  if (packageManager !== 'npm') {
    const destPath = path.join(process.cwd(), projectName as string);
    await removeFile('package-lock.json', destPath);
  }

  const nextSteps = `cd ${projectName as string}                 \n${
    install ? `执行 ${green(getPmInstallCommands(packageManager))} 安装依赖\n` : ''
  }执行 ${green(`${packageManager} run dev`)} 启动开发`;

  note(nextSteps, '下一步:');

  await setTimeout(1000);

  outro(`漂亮, 如果您有任何问题, 请联系chengzhenghao`);
}
