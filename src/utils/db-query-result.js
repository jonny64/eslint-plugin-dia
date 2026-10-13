module.exports = function is_db_hash_result(node) {
    if (!node || node.type != 'AwaitExpression') return false

    const call = node.argument
    if (call.type != 'CallExpression' || call.callee.type != 'MemberExpression' || call.callee.computed) return false

    const { object, property } = call.callee
    if (!property || property.type != 'Identifier') return false
    if (!(object.type == 'Identifier' && object.name == 'db') &&
        !(object.type == 'MemberExpression' && !object.computed && object.object.type == 'ThisExpression' && object.property.name == 'db')) return false

    if (property.name == 'select_hash') return true
    if (property.name != 'get') return false

    let def = call.arguments[0]
    if (def?.type == 'ArrayExpression') def = def.elements[0]

    let name
    if (def?.type == 'Literal') name = def.value
    else if (def?.type == 'ObjectExpression' && def.properties.length == 1) {
        const field = def.properties[0]
        if (field.type != 'Property' || field.computed) return false
        name = field.key.type == 'Identifier' ? field.key.name : field.key.value
    }
    if (typeof name != 'string') return false

    const part = name.trim().split(/\s+ON\s+/)[0]
    if (!part.includes('(')) return true
    const columns = part.split(/[()]/)[1]
    if (!columns || columns.split(',').some(c => c.trim() == '*')) return true
    return columns.split(',').length > 1
}
