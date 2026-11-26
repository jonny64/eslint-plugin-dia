module.exports = {
    meta: {
        messages: {
            no_darn: 'darn() is not allowed; save the error to DB fields via fork on action:abort',
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
