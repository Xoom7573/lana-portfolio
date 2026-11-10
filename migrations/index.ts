import * as migration_20261110_215501_initial from './20261110_215501_initial';

export const migrations = [
  {
    up: migration_20261110_215501_initial.up,
    down: migration_20261110_215501_initial.down,
    name: '20261110_215501_initial'
  },
];
