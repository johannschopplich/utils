import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/array',
    'src/csv',
    'src/emitter',
    'src/json',
    'src/lazy',
    'src/module',
    'src/object',
    'src/path',
    'src/string',
    'src/types',
  ],
  clean: true,
  declaration: true,
})
