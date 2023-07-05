/**
 * @file index.js
 * @brief Main entry point for the extensions compiler.
 * @author Lily Stilson
 */ 

import * as esprima from 'esprima';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { runTests } from './tests/test.js';

async function main() {
    const {
        values: { input, output }
    } = parseArgs({
        options: {
            input:  { type: "string", short: "i" },
            output: { type: "string", short: "o" }
        }
    });

    let scripts = await fs.readdir(path.resolve(input));
    scripts = scripts.filter((script) => script.endsWith(".js"));
    scripts = scripts.map((script) => path.resolve(input, script));

    for (const script of scripts) {
        runTests(script)
    }
}

(async () => {
    await main()
})().catch((e) => {
    console.error(e);
    process.exit(1);
})
