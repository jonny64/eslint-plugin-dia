module.exports = {
    meta: {
        messages: {
            no_darn: 'Using `darn` in production is prohibited.',
        },
    },
    create(context) {
        return {
            CallExpression(node) {
                if (node.callee.type !== 'Identifier') return
                if (node.callee.name !== 'darn') return
                context.report({node, messageId: 'no_darn'})
            },
        }
    },
}
