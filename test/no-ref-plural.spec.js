const { RuleTester } = require('eslint')
const noEmptyCatchRule = require('../src/no-ref-plural.js')
const ruleTester = new RuleTester()
ruleTester.run('no-ref-plural', noEmptyCatchRule, {
    valid: [
        { code: `{id_priority : '(voc_priorities) // Priority'}` },
        { code: `{id_voc_nds  : '(voc_nds) // VAT'}` },
        { code: `{uuid_priority : '(voc_priorities) // Priority'}` },
    ],
    invalid: [
        {
            code: `{id_priorities: '(voc_priorities) // Priority'}`,
            errors: [{ messageId: 'no_ref_plural' }],
        },
        {
            code: `{uuid_priorities: '(voc_priorities) // Priority'}`,
            errors: [{ messageId: 'no_ref_plural' }],
        },
    ]
})