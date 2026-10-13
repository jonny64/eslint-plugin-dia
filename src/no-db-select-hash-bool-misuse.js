const is_db_hash_result = require('./utils/db-query-result')

function is_boolean_test(node) {
    const { parent } = node
    if (!parent) return false
    if (parent.type == 'UnaryExpression' && parent.operator == '!') return true
    if (parent.type == 'LogicalExpression' && (parent.operator == '&&' || parent.operator == '||')) {
        return parent.left == node || is_boolean_test(parent)
    }
    return (parent.type == 'IfStatement' || parent.type == 'WhileStatement' || parent.type == 'DoWhileStatement' ||
        parent.type == 'ForStatement' || parent.type == 'ConditionalExpression') && parent.test == node
}

module.exports = {
    meta: {
        messages: {
            boolMisuse: 'db.get/select_hash returns {} on no row; check a field, not the object.',
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
            AwaitExpression(node) {
                if (node.parent.type == 'VariableDeclarator' || !is_db_hash_result(node)) return
                if (is_boolean_test(node)) context.report({ node, messageId: 'boolMisuse' })
            },
            'Program:exit'() {
                for (const variable of results) {
                    if (variable.references.some(ref => ref.isWrite() && !ref.init)) continue
                    for (const ref of variable.references) {
                        if (ref.isRead() && is_boolean_test(ref.identifier)) {
                            context.report({ node: ref.identifier, messageId: 'boolMisuse' })
                        }
                    }
                }
            },
        }
    },
}
