const { RuleTester } = require('eslint')
const rule = require('../src/no-db-select-hash-optional-chaining')
const rt = new RuleTester({ parserOptions: { ecmaVersion: 2022 } })

rt.run('no-db-select-hash-optional-chaining', rule, {
    valid: [
        `async function load() {
            const row = await db.select_hash('SELECT uuid FROM tp_docs')
            if (!row.uuid) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.select_hash('SELECT uuid FROM tp_docs')
            if (!row.uuid?.length) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.select_scalar('SELECT uuid FROM tp_docs')
            if (!row?.length) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.get({'tp_docs(uuid)': id})
            if (!row?.length) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.get(def)
            if (!row?.uuid) throw Error('not found')
        }`,
        `async function load() {
            const row = await this.call('get_tp_doc')
            if (!row?.uuid) throw Error('not found')
        }`,
        `async function load() {
            let row = await db.select_hash('SELECT uuid FROM tp_docs')
            row = maybeNull()
            if (!row?.uuid) throw Error('not found')
        }`,
        `async function load() {
            const row = await db.select_hash('SELECT uuid FROM tp_docs')
            { const row = maybeNull(); if (!row?.uuid) throw Error('not found') }
        }`,
        `async function load() {
            const row = await cache.get('key')
            if (!row?.uuid) throw Error('not found')
        }`,
    ],
    invalid: [
        {
            code: `async function load(files) {
                const { db } = this
                const tp_doc = await db.get({ tp_docs: files[0].uuid_tp_doc })
                if (!tp_doc?.uuid) throw Error('not found')
            }`,
            errors: [{ messageId: 'optionalChaining' }],
        },
        {
            code: `async function load() {
                const doc = await this.db.select_hash('SELECT uuid FROM tp_docs')
                if (!doc?.uuid) throw Error('not found')
            }`,
            errors: [{ messageId: 'optionalChaining' }],
        },
        {
            code: `async function load() {
                const row = await db.get({'tp_docs(uuid, id_status)': id})
                return row?.uuid
            }`,
            errors: [{ messageId: 'optionalChaining' }],
        },
        {
            code: `async function load() {
                const row = await db.select_hash('SELECT uuid FROM tp_docs')
                return row?.[key]
            }`,
            errors: [{ messageId: 'optionalChaining' }],
        },
        {
            code: `async function load() {
                return (await db.select_hash('SELECT uuid FROM tp_docs'))?.uuid
            }`,
            errors: [{ messageId: 'optionalChaining' }],
        },
        {
            code: `async function load() {
                const row = await db.select_hash('SELECT uuid FROM tp_docs')
                return row?.uuid?.length
            }`,
            errors: [{ messageId: 'optionalChaining' }],
        },
    ],
})
