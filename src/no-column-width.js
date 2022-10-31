
module.exports = {
    meta: {
        messages: {
            no_column_width: 'draw_table.columns.width is required at least for one column',
        },
    },
    create(context) {

        const get_literal = (i, key) => {
            if (!i.key) return null
            if (i.key && i.key.name !== key) return null
            if (!i.value) return null
            return i.value.value
        }

        return {
            CallExpression (node) {
                if (node.callee.property && node.callee.property.name != 'draw_table') return
                let o = node.arguments [0]
                if (!o) return
                if (!o.properties) return
                for (let i of o.properties || []) {
                    if (i.key && i.key.name !== 'columns') continue
                    if (!i.value) continue
                    if (!i.value.elements) continue

                    let list = []
                    for (let col of i.value.elements || []) {
                        for (let p of col.properties || []) {
                            let w = get_literal (p, 'width')
                            if (!w) continue
                            list.push (w)
                        }
                    }

                    if (!list.length) {
                        context.report({ node, messageId: 'no_column_width'})
                    }
                }
            }
        }
    }
}