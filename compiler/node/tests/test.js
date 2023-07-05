import { test, describe } from "node:test"
import assert from "node:assert"
import * as fs from "node:fs/promises"

// esprima import workaround :/
import * as esprimaLoad from 'esprima'
const esprima = esprimaLoad.default?esprimaLoad.default:esprimaLoad;

export async function runTests(script) {
    let contents = await fs.readFile(script, "utf-8")
    let program = esprima.parse(contents)

    describe(`Testing ${script}`, () => {
        // Extension object test
        // should exist
        test("Extension object test", async (t) => {
            await t.test("Exists", () => {
                assert.notStrictEqual(program.body.find(
                    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "Extension"
                ), undefined)
            })

            await t.test("Is an object", () => {
                assert.strictEqual(program.body.find(
                    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "Extension"
                ).declarations[0].init.type, "ObjectExpression")
            })

            await t.test("Has required properties", () => {
                let properties = program.body.find(
                    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "Extension"
                ).declarations[0].init.properties

                assert.notStrictEqual(properties.find((property) => property.key.name === "name"), undefined)
                assert.notStrictEqual(properties.find((property) => property.key.name === "kind"), undefined)
                assert.notStrictEqual(properties.find((property) => property.key.name === "api_type"), undefined)
                assert.notStrictEqual(properties.find((property) => property.key.name === "base_url"), undefined)
                assert.notStrictEqual(properties.find((property) => property.key.name === "tags_separator"), undefined)
                assert.notStrictEqual(properties.find((property) => property.key.name === "rate_limit"), undefined)
                assert.notStrictEqual(properties.find((property) => property.key.name === "network_access"), undefined)
                assert.notStrictEqual(properties.find((property) => property.key.name === "icon"), undefined)
            })
            
        })


    })
    
}
