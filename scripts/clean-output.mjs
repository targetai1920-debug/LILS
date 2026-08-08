#!/usr/bin/env node
import { rmSync } from 'node:fs';

for (const directory of ['.next', 'out']) {
  rmSync(directory, { recursive: true, force: true });
}
