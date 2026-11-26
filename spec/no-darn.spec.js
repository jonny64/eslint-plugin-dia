const { RuleTester } = require('eslint')
const rule = require('../src/no-darn')
const rt = new RuleTester({ parserOptions: { ecmaVersion: 2022 } })

rt.run('no-darn', rule, {
    valid: [
        'darned(error)',
        'global.darn = (o) => {}',
    ],
    invalid: [
        {
            code: 'darn (error)',
            errors: [{ messageId: 'no_darn' }],
        },
    ],
})
