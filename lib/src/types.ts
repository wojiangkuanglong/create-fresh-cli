export type Kit = {
  value: string;
  label: string;
  hint?: string;
};

export type Flags = {
  name: string;
  kit: string;
  git: boolean;
  install: boolean;
};

export type PackageManagers = 'npm' | 'yarn' | 'pnpm';
