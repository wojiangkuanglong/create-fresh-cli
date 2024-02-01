#!/usr/bin/env node
'use strict';

const NODE_VERSION = process.versions.node;

/** 获取当前Node版本 */
export const CLIENT_NODE_VERSION = parseInt(NODE_VERSION.split('.')[0]);

export const REQUIRED_MAJOR_VERSION = 16;

if (CLIENT_NODE_VERSION < REQUIRED_MAJOR_VERSION) {
  console.error(`您的 NodeJS 版本需要高于 ${REQUIRED_MAJOR_VERSION}`);
  process.exit(1);
}

import('./dist/index.js').then(({ main }) => main());
