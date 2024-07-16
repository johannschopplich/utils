import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/path/index'],
  clean: true,
  declaration: true,
})
