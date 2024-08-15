import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/array',
    'src/csv',
    'src/is',
    'src/json',
    'src/module',
    'src/object',
    'src/path',
    'src/string',
    'src/types',
  ],
  clean: true,
  declaration: true,
})
