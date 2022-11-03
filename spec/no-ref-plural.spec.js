const { RuleTester } = require('eslint')
const no_ref_plural = require('../src/no-ref-plural.js')
const rt = new RuleTester()
rt.run('no-ref-plural', no_ref_plural, {
    valid: [
        { code: `{id_priority : '(voc_priorities) // Priority'}` },
        { code: `{id_voc_nds  : '(voc_nds) // VAT'}` },
        { code: `{uuid_priority : '(voc_priorities) // Priority'}` },
        { code: `{uuid_device   : 'uuid // Device'}` },
        { code: `{uuid_fias     : 'uuid // Address'}` },
        { code: `{uuid_address  : 'uuid // Address'}` },
        { code: `{uuid_xks      : 'uuid // Some nitty-gritty abbreviation'}` },
        { code: `{id_system_gas : 'int  // Gas system'}` },
        { code: `{uuid_basis    : 'uuid // Some basis'}` },
        { code: `{uuid_out_gis  : 'uuid // Some gis'}` },
        { code: `{uuid_class    : 'uuid // Some class'}` },
        { code: `{uuid_some_res : 'uuid // Some resource'}` },
        { code: `{uuid_some_news : 'uuid // Some news item'}` },
        { code: `{uuid_xl_sheet : 'uuid // Some xl sheet'}` },
        { code: `{uuid_vks      : 'uuid // Some vks'}` },
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