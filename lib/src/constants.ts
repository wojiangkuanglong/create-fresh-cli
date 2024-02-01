import type { Kit } from './types';

/** 项目模板 */
export const AVAILABLE_KITS: Kit[] = [
  {
    label: 'react',
    value: 'git@github.com:wojiangkuanglong/create-fresh-cli.git',
    hint: 'React项目模版',
  },
  {
    label: 'vue',
    value: '',
    hint: 'Vue项目模版',
  },
  {
    label: 'node',
    value: '',
    hint: 'Node项目模版',
  },
];

/** 包模板 */
export const AVAILABLE_LIBRARIES: Kit[] = [
  {
    label: 'npm',
    value: '',
    hint: 'npm模版',
  },
];
