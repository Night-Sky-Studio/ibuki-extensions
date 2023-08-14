/**
 * @file index.js
 * @brief Main entry point for the extensions compiler.
 * @author Lily Stilson
 */ 

import * as fs from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'
// import { runTests } from './tests/test.js'

// esprima import workaround :/
import * as esprimaLoad from 'esprima'
const esprima = esprimaLoad.default?esprimaLoad.default:esprimaLoad;

async function main() {
    const {
        values: { input, output }
    } = parseArgs({
        options: {
            input:  { type: "string", short: "i" },
            output: { type: "string", short: "o", default: `${path.resolve("../")}/extensions.json` },
            // test: { type: "boolean", short: "t" }
        }
    })

    let scripts = await fs.readdir(path.resolve(input))
    scripts = scripts.filter((script) => script.endsWith(".js"))
    scripts = scripts.map((script) => path.resolve(input, script))

    let result = []
    
    for (const script of scripts) {
        let contents = await fs.readFile(script, "utf-8")
        
        if (contents.includes("const Extension")) {
            let extension = `const Extension = ${((contents.split("const Extension = ")[1]).split("}")[0] +"}").replace(/\s/g, "")}`

            try {
                let parsed = esprima.parse(extension)
                // find object properties and transform them into a JSON object
                let properties = parsed.body[0].declarations[0].init.properties
                let json = {}
                for (const property of properties) {
                    json[property.key.name] = property.value.value
                }

                result = [...result, json]

            } catch (e) {
                console.error(`Could not parse extension object of ${path.basename(script)}: ${e}`)
                continue
            }
        }
    }

    // full
    await fs.writeFile(output, JSON.stringify(result, null, 4))
    // minified
    await fs.writeFile(output.replace(".json", ".min.json"), JSON.stringify(result))
}

(async () => {
    await main()
})().catch((e) => {
    console.error(e)
    process.exit(1)
})
