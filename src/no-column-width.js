
module.exports = {
    meta: {
        messages: {
            no_column_width: 'draw_table.columns.width is required for each column',
        },
    },
    create(context) {

        const get_literal = (i, key) => {
            if (!i.key) return null
            if (i.key && i.key.name !== key) return null
            if (!i.value) return null
            return i.value.value
        }

        const get_func_name = (i, key) => {
            if (!i.key) return null
            if (i.key && i.key.name !== key) return null
            if (!i.value) return null
            return i.value.name
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

                    let cols = i.value.elements || []

                    if (cols.length == 1) {
                        return
                    }

                    for (let col of cols) {
                        if (col.type !== 'ObjectExpression') continue
                        let is_ok = 0
                        for (let p of col.properties || []) {
                            let formatter = get_func_name (p, 'formatter')
                            if (formatter) {
                                is_ok = /^_(dt|ts)/.test (formatter)
                                break
                            }
                            if (get_literal (p, 'width')) {
                                is_ok = 1
                                break
                            }
                            let has_class = p.key && p.key.name === 'class' && p.value
                            if (has_class) {
                                is_ok = 1
                                break
                            }
                        }
                        if (!is_ok) {
                            context.report({ node: col, messageId: 'no_column_width'})
                            return
                        }
                    }
                }
            }
        }
    }
}