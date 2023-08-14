import * as assert from "assert"
import { describe, it } from "mocha"

import * as fs from "node:fs/promises"
import path from "node:path"
import chalk from "chalk"

// esprima import workaround :/
import * as esprimaLoad from 'esprima'
const esprima = esprimaLoad.default?esprimaLoad.default:esprimaLoad;

const requiredProperties = ["name", "kind", "api_type", "base_url", "tags_separator", "rate_limit", "network_access", "icon"]
const functions = {
    required: [
        {
            name: "GetPosts",
            params: ["page", "limit", "search", "auth"],
            returns: "string"
        }, 
        {
            name: "GetPostChildren",
            params: ["id", "auth"],
            returns: "string"
        }
    ],
    optional: [
        {
            name: "GetUserFavorites",
            params: ["page", "limit", "username", "auth"],
        }, 
        {
            name: "GetTagSuggestion",
            params: ["search", "limit"]
        }
    ]
}

// find --input= in argv
let input = process.argv.find((arg) => arg.startsWith("--input="))
if (input) {
    input = input.split("=")[1]
} else {
    console.error(chalk.red("No input directory was specified. Use --input=<directory>."))
    process.exit(1)
}

let scripts = await fs.readdir(path.resolve(input))
scripts = scripts.filter((script) => script.endsWith(".js"))
scripts = scripts.map((script) => path.resolve(input, script))

for (const script of scripts) {
    let contents = await fs.readFile(script, "utf-8"),
        program

    try {
        program = esprima.parse(contents)
    } catch (e) {
        console.error(`Failed to parse ${chalk.blue(path.basename(script))}`)
        console.error(e)
        process.exit(1)
    }

    console.log(chalk.green(`Testing ${path.basename(script)}`))

    describe(`Testing ${chalk.blue(path.basename(script))}`, () => {
        describe("Extension object test", () => {
            it("Is valid script", () => {
                assert.notStrictEqual(program, undefined, "Failed to parse extension")
                assert.ok(JSON.stringify(program).indexOf("eval") === -1, "Usage of eval() is not allowed in Ibuki Extensions")
            })

            it("Exists", () => {
                assert.notStrictEqual(program.body.find(
                    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "Extension"
                ), undefined)
            })

            it("Is an object", () => {
                assert.strictEqual(program.body.find(
                    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "Extension"
                ).declarations[0].init.type, "ObjectExpression")
            })

            describe("Has required properties", () => {
                let properties = program.body.find(
                    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "Extension"
                )?.declarations[0].init.properties

                for (let property of requiredProperties) {
                    it(`Has ${property}`, () => {
                        assert.notEqual(properties.find((prop) => prop.key.name === property), undefined, `${property} is missing`)
                    })
                }
            })

            describe("Has valid properties", () => {
                let properties = program.body.find(
                    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "Extension"
                )?.declarations[0].init.properties

                for (let property of requiredProperties) {
                    it(`Has valid ${property}`, () => {
                        assert.strictEqual(properties.find((prop) => prop.key.name === property).value.type, "Literal")
                    })
                }
            })
        })

        describe("Extension functions test", () => {
            let f = program.body.filter(
                (node) => node.type === "FunctionDeclaration"
            )

            describe("Has required basic functions", () => {
                for (let requiredFunc of functions.required) {
                    it(`Has ${requiredFunc.name}()`, () => {
                        assert.notStrictEqual(f.find((func) => func.id.name === requiredFunc.name), undefined, `${requiredFunc}() is missing`);
                    })
                }
            })

            describe("Has advanced functions", () => {
                for (let optionalFunc of functions.optional) {
                    it(`Has ${optionalFunc.name}()`, () => {
                        assert.notStrictEqual(f.find((func) => func.id.name === optionalFunc.name), undefined, `${optionalFunc}() is missing`);
                    })
                }
            })

            describe("Additional functions", () => {
                it("Has no more than 10 additional functions" , () => {
                    assert.ok(f.length - functions.required.length - functions.optional.length <= 10, `Too many additional functions (${f.length})`)
                })
            })
        })

        // TODO
        // describe("Extension functionality test", () => {

            /*
            let f = program.body.filter(
                (node) => node.type === "FunctionDeclaration"
            )

            await t.test("Required functions", async (t) => {
                for (let requiredFunc of functions.required) {
                    await t.test(`${requiredFunc.name}() returns a string`, async () => {
                        let func = f.find((func) => func.id.name === requiredFunc.name),
                            body = func.body.body,
                            returnStatement = body.find((node) => node.type === "ReturnStatement"),
                            returns = returnStatement.argument

                        assert.notStrictEqual(returns.type, "Literal", `${requiredFunc.name}() returns an empty string`)

                        
                    })
                }
            })
            */

        // })
    })
}

