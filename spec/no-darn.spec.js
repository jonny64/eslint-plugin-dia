const { RuleTester } = require('eslint')
const rule = require('../src/no-darn')
const rt = new RuleTester({ parserOptions: { ecmaVersion: 2022 } })

it('uses the exact diagnostic', () => {
    expect(rule.meta.messages.no_darn).toBe('darn() is not allowed; save the error to DB fields via fork on action:abort')
})

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
