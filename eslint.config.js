import antfu from '@antfu/eslint-config'

export default await antfu({}, {
  rules: {
    'node/handle-callback-err': 'off',
  },
})
