const { RuleTester } = require('eslint')
const rule = require('../src/no-db-select-hash-bool-misuse')
const rt = new RuleTester({ parserOptions: { ecmaVersion: 2022 } })

rt.run('no-db-select-hash-bool-misuse', rule, {
    valid: [
        `async function load() {
            const row = await db.select_hash('SELECT uuid FROM tp_docs')
            if (!row.uuid) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.select_scalar('SELECT uuid FROM tp_docs')
            if (!row) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.get({'voc_agents(uuid_voc_agent)': id})
            if (!row) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.get([{'tp_docs(uuid)': id}, 'voc_doc_types(label)'])
            if (!row) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.get(['tp_docs(uuid)', 'voc_doc_types(label)'])
            if (!row) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.get(def)
            if (!row) throw Error('not found')
        }`,
        `async function load() {
            const rows = await db.select_all('SELECT * FROM tp_docs')
            const row = rows[0]
            if (!row) throw Error('not found')
        }`,
        `async function load() {
            let row = await db.select_hash('SELECT uuid FROM tp_docs')
            row = maybeNull()
            if (!row) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.select_hash('SELECT uuid FROM tp_docs')
            { const row = maybeNull(); if (!row) throw Error('not found') }
        }`,
        `async function load() {
            const row = await cache.get('key')
            if (!row) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.select_hash('SELECT uuid FROM tp_docs')
            const fallback = row ?? {}
            if (row.uuid) return fallback
        }`,
        `async function load() {
            const row = await db.select_hash('SELECT uuid FROM tp_docs')
            if (!row?.uuid) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.select_hash('SELECT uuid FROM tp_docs')
            return ready && row
        }`,
    ],
    invalid: [
        {
            code: `async function load(files) {
                const { db } = this
                const tp_doc = await db.get({ tp_docs: files[0].uuid_tp_doc })
                if (!tp_doc) throw Error('not found')
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                const tp_doc = await this.db.select_hash('SELECT uuid FROM tp_docs')
                if (!tp_doc) throw Error('not found')
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                const doc = await db.get({'tp_docs(uuid, id_status)': id})
                if (doc) return doc.uuid
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                const doc = await db.get(['tp_docs(uuid, id_status)', 'voc_doc_types(label)'])
                if (!doc) return
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                const doc = await db.get({'tp_docs AS t': id})
                if (!doc) return
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                const doc = await db.get({'tp_docs(*)': id})
                if (!doc) return
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                const row = await db.select_hash('SELECT uuid FROM tp_docs')
                if (row && row.uuid) return row.uuid
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                const row = await db.select_hash('SELECT uuid FROM tp_docs')
                if (ready && row) return row.uuid
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                const row = await db.select_hash('SELECT uuid FROM tp_docs')
                return row ? row.uuid : null
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
        {
            code: `async function load() {
                if (!(await db.select_hash('SELECT uuid FROM tp_docs'))) throw Error('not found')
            }`,
            errors: [{ messageId: 'boolMisuse' }],
        },
    ],
})
