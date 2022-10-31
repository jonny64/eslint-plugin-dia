const { RuleTester } = require('eslint')
const no_column_width = require('../src/no-column-width.js')
const rt = new RuleTester()
rt.run('no-column-width', no_column_width, {
    valid: [
        {
            code: `
                $el.draw_table ({
                    columns: [
                        {
                            field: 'id_voc_md_status',
                            name: 'Статус',
                            width: '10%',
                            sortable: true,
                            filter: {type: 'checkboxes', title: '[поиск...]', op: 'is'},
                            voc: data.voc_md_status,
                        },
                        {
                            field: 'id_voc_md_kind',
                            name: 'Вид оборудования',
                            width: '5%',
                            sortable: true,
                            filter: {type: 'checkboxes', title: '[поиск...]', op: 'is'},
                            voc: data.voc_md_kinds,
                        },
                    ]
                })
            ` },
    ],
    invalid: [
        {
            code: `
                $el.draw_table ({
                    columns: [
                        {
                            field: 'id_voc_md_status',
                            name: 'Статус',
                            sortable: true,
                            filter: {type: 'checkboxes', title: '[поиск...]', op: 'is'},
                            voc: data.voc_md_status,
                        },
                        {
                            field: 'id_voc_md_kind',
                            name: 'Вид оборудования',
                            width: undefined,
                            sortable: true,
                            filter: {type: 'checkboxes', title: '[поиск...]', op: 'is'},
                            voc: data.voc_md_kinds,
                        },
                    ]
                })
            `,
            errors: [{ messageId: 'no_column_width' }],
        },
    ]
})