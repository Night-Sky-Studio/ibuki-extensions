import { $ } from "bun"
import path from "node:path"
import { readdir, mkdir, cp, rm } from "node:fs/promises"
import { zip as zipCb, type AsyncTerminable, type AsyncZipOptions, type AsyncZippable } from "fflate"
import { promisify } from "node:util"
const zip = (data: AsyncZippable, opts: AsyncZipOptions) => new Promise<Uint8Array<ArrayBufferLike>>((resolve, reject) => {
    zipCb(data, opts, (err: Error | null, result: Uint8Array) => {
        if (err) reject(err)
        else resolve(result)
    })
})


const extensionsDir = path.join(import.meta.dir, "extensions")
const outputDir = path.join(import.meta.dir, "out")
console.info("Extensions directory:", extensionsDir)
console.info("Output directory:", outputDir)

const extensions = await readdir(extensionsDir)
console.log(`Building ${extensions.length} extensions...`)


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

    // copy icon.png to output dir
    await cp(path.join(extensionsDir, extension, "icon.png"), path.join(extensionOutputDir, "icon.png"))

    // create compressed zip
    const archive = await zip({
        "index.js": await Bun.file(extensionOutput).bytes(),
        "icon.png": await Bun.file(path.join(extensionOutputDir, "icon.png")).bytes(),
    }, {
        level: 9
    })

    await Bun.write(path.join(outputDir, `${extension}.zip`), archive)

    // remove uncompressed output folder
    await rm(extensionOutputDir, { recursive: true, force: true })

    console.log(`\t${extension} -> ${extensionOutput}`)
}


for (let i = 0; i < extensions.length; i++) {
    const extension = extensions[i]! // <-- wtf

    console.log(`[${i + 1} / ${extensions.length}] ${extension}`)

    await buildExtension(extension, true)
}

console.log("Done!")