const is_db_hash_result = require('./utils/db-query-result')

module.exports = {
    meta: {
        messages: {
            optionalChaining: 'db.get/select_hash returns an object; remove ?. on the result.',
        },
    },
    create(context) {
        const results = []
        return {
            VariableDeclarator(node) {
                if (node.id.type != 'Identifier' || !is_db_hash_result(node.init)) return
                const [variable] = context.getDeclaredVariables(node)
                if (variable) results.push(variable)
            },
            'MemberExpression[optional=true]'(node) {
                if (is_db_hash_result(node.object)) context.report({ node, messageId: 'optionalChaining' })
            },
            'Program:exit'() {
                for (const variable of results) {
                    if (variable.references.some(ref => ref.isWrite() && !ref.init)) continue
                    for (const ref of variable.references) {
                        const { parent } = ref.identifier
                        if (parent.type == 'MemberExpression' && parent.optional && parent.object == ref.identifier) {
                            context.report({ node: parent, messageId: 'optionalChaining' })
                        }
                    }
                }
            },
        }
    },
}
