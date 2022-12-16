
function toBlocks(comments) {
    const blocks = []
    let prevLine
    for (const comment of comments) {
      if (comment.type === "Block") {
        blocks.push({
          content: comment.value.replace(/^\s*\*/, "").replace(/\n\s*\*/g, "\n"),
          loc: { ...comment.loc },
        });
        prevLine = undefined
      } else if (comment.type === "Line") {
        if (prevLine && prevLine.loc.start.line === comment.loc.start.line - 1) {
          const prevBlock = blocks[blocks.length - 1]
          prevBlock.content += `\n${comment.value}`
          prevBlock.loc.end = comment.loc.end
        } else {
          blocks.push({
            content: comment.value,
            loc: { ...comment.loc },
          })
        }
        prevLine = comment
      }
    }
    return blocks
}

function hasEmptyBody(program) {
    return program.type === "Program" && program.body.length === 0
        || program.body.length === 1 && program.body [0].type === "ExpressionStatement" && program.body [0].expression && program.body [0].expression.type === "Identifier"
}

function hasExpressionBody(program) {

    return (
        program.type === "Program"
        && program.body.every(
            (statement) =>
                statement.type === "ExpressionStatement"
                || statement.type === "CallExpression"
                && isValidExpressionStatement(statement.expression)
        )
    )
}

function isValidExpressionStatement(node) {

    switch (node.type) {
        case "Identifier":
        case "Literal":
        case "CallExpression":
        case "ObjectExpression":
        case "BinaryExpression":
        case "VariableDeclaration":
        case "ExpressionStatement":
            return true
    }

    return false
}

function wrapContent(content, node) {
    if (!node) return undefined

    switch (node.type) {
        case "ArrayExpression":
        return `let wrapper = [${content}]`
        case "ClassBody":
        return `class Wrapper { ${content} }`
        case "ImportDeclaration":
        return `import { ${content} } from "wrapper"`
        case "ObjectExpression":
        return `let wrapper = { ${content} }`
        case "FunctionDeclaration":
        return `function wrapper(${content}) {}`
        case "SwitchStatement":
        return `switch (wrapper) { ${content} }`
        default:
        return undefined
    }
}

module.exports = {
    meta: {
        messages: {
            no_commented_out_code: 'commented out code is forbidden "{{src}}"',
        },
    },
    create(context) {

        const { parse } = require (context.parserPath)
        const { project, ...parserOptions } = context.parserOptions
        const sourceCode = context.getSourceCode()

        return {
            Program () {
                const comments = context.getSourceCode().getAllComments()
                const blocks = toBlocks (comments)
                for (const block of blocks) {

                    const { content, loc } = block

                    try {
                        const program = parse(content, parserOptions)
                        if (
                            !hasEmptyBody(program)
                        ) {
                            context.report({
                                loc,
                                messageId: "no_commented_out_code",
                                data: {src: content},
                            })
                        }
                        continue
                    } catch (x) {
                        // is not code comment
                    }

                    // Comments within certain nodes - e.g. class declarations - need to
                    // be wrapped in a similar context to determine whether or not they
                    // are commented-out code.
                    const index = sourceCode.getIndexFromLoc(loc.start)
                    const node = sourceCode.getNodeByRangeIndex(index)
                    const wrappedContent = wrapContent(content, node)
                    if (wrappedContent) {
                        try {
                            parse(wrappedContent, parserOptions)
                            context.report({
                                loc,
                                messageId: "no_commented_out_code",
                                data: {src: content},
                            })
                        } catch (x) {
                            // is not code comment
                        }
                    }
                }
            }
        }
    }
}