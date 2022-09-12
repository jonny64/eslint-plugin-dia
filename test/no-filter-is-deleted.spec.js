const { RuleTester } = require('eslint')
const no_filter_is_deleted = require('../src/no-filter-is-deleted.js')
const rt = new RuleTester()
rt.run('no-filter-is-deleted', no_filter_is_deleted, {
    valid: [
        { code: `
            this.db.add_vocabularies ({
                _fields: this.db.model.tables.tb_entities.columns,
            }, {
                voc_entity_types: {
                    filter: 'is_ok = 1::bit',
                },
            })
        `},
        { code: `
            this.db.add_vocabularies ({
                _fields: this.db.model.tables.tb_entities.columns,
            }, {
                voc_entity_types: {},
            })
        `},
        { code: `
            db.add_vocabularies ({
                _fields: this.db.model.tables.tb_entities.columns,
            })
        `},
    ],
    invalid: [
        {
            code: `
                this.db.add_vocabularies ({
                    _fields: this.db.model.tables.tb_entities.columns,
                }, {
                    voc_entity_types: {
                        filter: 'is_deleted = 0::bit AND is_lease = 1::bit',
                        filter: 'is_lease = 1::bit',
                    },
                })
            `,
            errors: [{ messageId: 'no_filter_is_deleted' }],
        },
    ]
})