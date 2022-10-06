let en_unplural = function (s) {

    if (s.match (/(status|goods|nds|fias|address|gas|gis|basis|class|_res|news|sheet|vks)$/)) return s

    if (s.match (/^\w\ws$/)) return s

    var table = [
        [/tives$/,          'tive'],
        [/ives$/,            'ife'],
        [/ves$/,               'f'],
        [/ies$/,               'y'],
        // [/ice$/,            'ouse'],
        [/men$/,             'man'],
        [/eet(h?)$/,       'oot$1'],
        [/(o|ch|sh|ss|x)es$/, '$1'],
        [/s$/,                  '']
    ]

    for (i = 0; i < table.length; i++) {
        var re = table [i] [0]
        if (!s.match (re)) continue
        return s.replace (re, table [i] [1])
    }

    return s;

}

module.exports = {
    meta: {
        messages: {
            no_ref_plural: 'id_${en_plural} column names are not allowed: "{{ name }}" ',
        },
    },
    create(context) {
        return {
            Identifier (node) {
                if (/^(uu)?id_/.test (node.name)) {
                    let t = node.name.split (/^(?:uu)?id_/) [1]
                    let t_single = en_unplural (t)
                    if (t != t_single) {
                        context.report({ node, messageId: 'no_ref_plural', data: {name: node.name}})
                    }
                }
            }
        }
    }
}