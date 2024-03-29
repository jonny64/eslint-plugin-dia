const { RuleTester } = require('eslint')
const no_column_width = require('../src/no-column-width.js')
const rt = new RuleTester({
    "parserOptions": {
        "ecmaVersion": "2020"
    }
})
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
            {
                code: `
                    $el.draw_table ({
                        columns: [
                            {
                                hideInColumnTitleRow: true,
                                class: Slick.CheckboxSelectColumn,
                            },
                            {
                                field   : 'label',
                                name    : 'Наименование',
                                width   : 50,
                                filter  : {type: 'text', title: '[поиск...]'},
                            },
                        ]
                    })
            `},
            {
                code: `
                    $el.draw_table ({
                        columns: [
                            {
                                field   : 'label',
                                name    : 'Наименование',
                                width   : 50,
                                filter  : {type: 'text', title: '[поиск...]'},
                            },
                            ... [
                                'label',
                                'oktmo',
                                'okato',
                            ].map (f => to_log_column (f, data))
                        ]
                    })
            `},
            {
                code: `
                    $el.draw_table ({
                        columns: [
                            {
                                field   : 'label',
                                name    : 'Наименование',
                                filter  : {type: 'text', title: '[поиск...]'},
                            },
                        ]
                    })
            `},
            {
                code: `
                    $el.draw_table ({
                        columns: [
                            {
                                field: '_uuid',
                                hideInColumnTitleRow: true,
                                class: Slick.CheckboxSelectColumn,
                                off: +data.is_deleted,
                            },
                            {
                                field: 'id_voc_md_status',
                                name: 'Статус',
                                width: '10%',
                                sortable: true,
                                filter: {type: 'checkboxes', title: '[поиск...]', op: 'is'},
                                voc: data.voc_md_status,
                            },                        ]
                    })
                `
            },
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
                                field: 'dt',
                                name: 'Дата',
                                formatter: _dt,
                            },
                        ]
                    })
                `
            },
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
                                field: 'ts',
                                name: 'Дата с временем',
                                formatter: _tss,
                            },
                        ]
                    })
                `
            },
            {
                code: `
                    $el.draw_table({
                        columns: [
                            {
                                field: "total",
                                name: "Сумма",
                                formatter: _decimal,
                                width: '10%',
                                filter: {type: 'numeric'},
                            },
                            {
                                field: 'reason',
                                name: 'Основание',
                                filter: { type: 'text', title: '[поиск...]' },
                                width: '15%',
                            }
                        ],
                    })

                `
            },
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
        {
            code: `
                $el.draw_table ({
                    columns: [
                        {
                            hideInColumnTitleRow: true,
                            class: Slick.CheckboxSelectColumn,
                        },
                        {
                            field   : 'label',
                            name    : 'Наименование',
                            filter  : {type: 'text', title: '[поиск...]'},
                        },
                    ]
                })
            `,
            errors: [{ messageId: 'no_column_width' }],
        },
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
                            field: 'ts',
                            name: 'Дата с временем',
                            formatter: _tss,
                        },
                    ]
                })
            `,
            errors: [{ messageId: 'no_column_width' }],
        },
    ]
})