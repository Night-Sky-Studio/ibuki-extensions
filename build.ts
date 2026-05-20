import { $ } from "bun"
import path from "node:path"
import { readdir, mkdir, cp, rm, exists } from "node:fs/promises"
import { parseArgs } from "node:util"
import type { BaseExtension, Extension } from "types";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        configuration: {
            type: "string",
            default: "release"
        },
        name: {
            type: "string",
            default: undefined
        },
        clean: {
            type: "boolean",
            default: false
        }
    },
    allowPositionals: true
})

const { configuration, name, clean } = values
console.info("Configuration:", configuration)

const extensionsDir = path.join(import.meta.dir, "extensions")
const outputDir = path.join(import.meta.dir, "out")
console.info("Extensions directory:", extensionsDir)
console.info("Output directory:", outputDir)

if (clean) {
    console.log("Cleaning output directory...")
    await rm(outputDir, { recursive: true, force: true })
}

let extensions: string[] = []

if (!name) {
    extensions = await readdir(extensionsDir)
    console.log(`Building ${extensions.length} extensions...`)
} else {
    extensions = [name]
    console.log(`Building extension "${name}"...`)
}

let extensionsManifest: BaseExtension[] = []

async function processExtension(extension: string) {
    const extensionDir = path.join(extensionsDir, extension)

    // extract extension information
    const extensionModule: BaseExtension = (await import(path.join(extensionDir, "index.ts"))).default
    if (!extensionModule) {
        throw new Error(`Extension "${extension}" does not have a default export.`)
    }

    extensionsManifest.push(extensionModule)
}

async function buildExtension(extension: string, debug = false) {
    const extensionOutputDir = path.join(outputDir, extension)
    await mkdir(extensionOutputDir, { recursive: true })
    const extensionOutput = path.join(extensionOutputDir, "index.js")

    const extensionPath = path.join(extensionsDir, extension, "index.ts")
    
    if (debug) {
        await $`bun build ${extensionPath} --outfile "${extensionOutput}"`.quiet()
    } else {
        await $`bun build ${extensionPath} --outfile "${extensionOutput}" --minify`.quiet()
    }

    // copy icon.svg/png to output dir
    if (await exists(path.join(extensionsDir, extension, "icon.svg"))) {
        await cp(path.join(extensionsDir, extension, "icon.svg"), path.join(extensionOutputDir, "icon.svg"))
    } else if (await exists(path.join(extensionsDir, extension, "icon.png"))) {
        await cp(path.join(extensionsDir, extension, "icon.png"), path.join(extensionOutputDir, "icon.png"))
    } else {
        console.warn(`No icon found for extension "${extension}". Check if "icon.svg" or "icon.png" are present in the extension directory.`)
    }

    console.log(`\t${extension} -> ${extensionOutput}`)
}


for (let i = 0; i < extensions.length; i++) {
    const extension = extensions[i]! // <-- wtf

    console.log(`[${i + 1} / ${extensions.length}] ${extension}`)

    await processExtension(extension)

    await buildExtension(extension, true)
}

if (!name) {
    console.log("Writing extensions manifest...")
    await Bun.write(path.join(outputDir, "manifest.json"), JSON.stringify(extensionsManifest, null, 2))
}

console.log("Done!")