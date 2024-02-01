import { isCancel, cancel } from '@clack/prompts';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { simpleGit } from 'simple-git';

const git = simpleGit();

import { PackageManagers } from './types';

/** 处理用户取消操作 */
export function handleCancelation(value: unknown) {
  if (!value) return;
  if (isCancel(value)) {
    cancel('操作取消 💔');
    process.exit(0);
  }
}

/** 检查文件是否存在 */
export async function fileExists(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch (error: unknown) {
    if ((error as any).code === 'ENOENT') {
      return false;
    } else {
      throw error;
    }
  }
}

/** 执行命令初始化新的 git 仓库 */
export async function initGitRepo(path: string) {
  return new Promise((resolve, reject) => {
    exec(`git init ${path}`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}

export async function getKitFromGitHub(github: string, projectName: string) {
  const destFolder = path.join(process.cwd(), projectName);

  try {
    await git.clone(github, destFolder);
  } catch (error: unknown) {
    cancel(error instanceof Error ? error.message : '出错了 💔');
    process.exit(1);
  }
}

/** 从给定路径中删除文件 */
export async function removeFile(fileName: string, directoryPath: string): Promise<boolean> {
  let removed: boolean;
  try {
    await fs.unlink(path.join(directoryPath, fileName));
    removed = true;
  } catch (err) {
    removed = false;
  }
  return removed;
}

/** 从给定路径中删除文件夹 */
export async function removeFolder(folderName: string, directoryPath: string): Promise<boolean> {
  let removed: boolean;
  try {
    await fs.rm(path.join(directoryPath, folderName), { recursive: true, force: true });
    removed = true;
  } catch (err) {
    removed = false;
  }
  return removed;
}

/** 初始化项目并用项目名称更新 package.json */
export async function initNodeProject(
  packageJsonPath: string,
  projectDestPath: string,
  projectName: string
) {
  const packageJSON = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  packageJSON.name = projectName;
  packageJSON.version = '1.0.0';

  try {
    await fs.writeFile(
      path.join(projectDestPath, 'package.json'),
      JSON.stringify(packageJSON, null, 2)
    );

    await removeFile('package-lock.json', projectDestPath);
    await removeFile('yarn.lock', projectDestPath);
    await removeFile('pnpm-lock.yaml', projectDestPath);
  } catch (_) {
    cancel('更新 package.json 失败。您可能需要手动更新');
  }
}

/**
 * 安装项目的依赖项，保留lock文件
 * 对于非 NPM 软件包管理器，我们将使用 `install` 命令并生成一个新的锁文件
 */
export const getPmInstallCommands = (pm: PackageManagers = 'npm') => {
  const commands = {
    npm: 'npm ci',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
  };
  return commands[pm];
};
