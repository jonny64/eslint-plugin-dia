const { RuleTester } = require('eslint')
const no_commented_out_code = require('../src/no-commented-out-code.js')
const rt = new RuleTester()
rt.run('no-commented-out-code', no_commented_out_code, {
    valid: [
        { code: `
            module.exports = {
                columns : {
                    id         : 'int2      // PK',
                    label      : 'string    // Наименование',
                },
            }
        `},
        { code: `
            add_vocabularies ({}, {
                voc_nds: 1,
            })
        `},
    ],
    invalid: [
        {
            code: `// var  x = 1`,
            errors: [{ messageId: 'no_commented_out_code' }],
        },
        {
            code: `
            // add_vocabularies ({}, {
            //     voc_nds: 1,
            // })
            `,
            errors: [{ messageId: 'no_commented_out_code' }],
        },
        {
            code: `
            var y = {
                onClick: function (e) {
                    // e.onComplete = function () {
                    // 		w2ui ['some_grid'].reload ()
                    // 	}
                },
            }
            `,
            errors: [{ messageId: 'no_commented_out_code' }],
        },
    ]
})