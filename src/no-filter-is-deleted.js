
module.exports = {
    meta: {
        messages: {
            no_filter_is_deleted: 'filter.is_deleted are not allowed, please filter front side: "{{k}}: {{v}}" ',
        },
    },
    create(context) {
        return {
            CallExpression (node) {
                if (node.callee.property.name != 'add_vocabularies') return
                let vocs = node.arguments [1]
                if (!vocs) return
                for (let i of vocs.properties || []) {
                    if (!/^voc_/.test (i.key.name)) continue
                    for (let f of i.value.properties) {
                        if (/is_deleted\s*=\s*0/.test (f.value.raw)) {
                            context.report({ node, messageId: 'no_filter_is_deleted', data: {k: i.key.name, v: f.value.raw}})
                        }
                    }
                }
            }
        }
    }
}