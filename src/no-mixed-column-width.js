
module.exports = {
    meta: {
        messages: {
            no_mixed_column_width: 'draw_table.columns.width mixed % and N width are not allowed: "{{list}}" ',
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
                    let percents = []
                    let proportions = []
                    for (let col of i.value.elements || []) {
                        for (let p of col.properties || []) {
                            let w = get_literal (p, 'width')
                            let f = get_literal (p, 'formatter')
                            let c = get_literal (p, 'class')
                            let is_width = w || /^_dt/.test (f) || /^_ts/.test (f) || c
                            if (!is_width) continue
                            if (/^\d+$/.test (w)) proportions.push (w)
                            if (/%$/.test (w)) percents.push (w)
                            list.push (w)
                        }
                    }

                    if (percents.length && proportions.length) {
                        context.report({ node, messageId: 'no_mixed_column_width', data: {list}})
                    }
                }
            }
        }
    }
}