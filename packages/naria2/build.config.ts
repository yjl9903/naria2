import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index', 'src/options', 'src/transport'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true
  }
});
