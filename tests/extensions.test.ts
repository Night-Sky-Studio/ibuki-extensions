import { describe, test, expect } from "bun:test"
import path from "node:path"
import { readdir } from "node:fs/promises"
import type { BooruPost, Tag } from "types"

const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe("Extensions tests", async () => {
    const extensionsDir = path.resolve(path.join(import.meta.dir, "..", "extensions"))
    const extensions = await readdir(extensionsDir)

    for (const ext of extensions) {
        const extName = path.basename(ext)

    const extensionModule = await import(path.join(extensionsDir, ext, "index.ts"))

        test("loaded", () => {
            expect(extensionModule.default).toBeDefined()
        })

        describe.skipIf(extensionModule.IGNORE_TESTS)(`${extName} base tests`, async () => {
            const extension = extensionModule.default

            test.failingIf(extension.getPosts === undefined)
            ("getPosts({ page: 1..5, limit: 10 })", async () => {
                test.failingIf(extension.getPosts === undefined)
                let posts: BooruPost[] = []

                for (let page = 1; page <= 5; page++) {
                    expect(async () => posts = await extension.getPosts({ page, limit: 10 }))
                        .not.toThrow()
                    await waitFor(extension.rateLimit ?? 1000) // respect rate limit
                    expect(posts.length).toBeGreaterThan(0)
                    expect(posts[0]).toHaveProperty("id")
                }
            })

            test.failingIf(extension.searchTags === undefined)
            ("searchTags(\"a\")", async () => {
                let tags: Tag[] = []
                expect(async () => tags = await extension.searchTags("spo"))
                    .not.toThrow()
                await waitFor(extension.rateLimit ?? 1000) // respect rate limit
                expect(tags.length).toBeGreaterThan(0)
                expect(tags[0]).toHaveProperty("name")
            })
        })
    }
})