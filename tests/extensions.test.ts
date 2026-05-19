import Bun from "bun"
import { describe, test, expect } from "bun:test"
import path from "node:path"
import { readdir } from "node:fs/promises"
import type { BooruPost, Tag } from "types"

describe("Extensions tests", async () => {
    const extensionsDir = path.resolve(path.join(import.meta.dir, "..", "extensions"))
    const extensions = await readdir(extensionsDir)

    for (const ext of extensions) {
        const extName = path.basename(ext)

        describe(`${extName} base tests`, async () => {
            const extension = await import(path.join(extensionsDir, ext, "main.ts")).then(m => m.default)

            test("loaded", () => {
                expect(extension).toBeDefined()
            })

            test("getPosts({ page: 1..10, limit: 10 })", async () => {
                test.failingIf(extension.getPosts === undefined)
                let posts: BooruPost[] = []

                for (let page = 1; page <= 10; page++) {
                    expect(async () => posts = await extension.getPosts({ page, limit: 10 }))
                        .not.toThrow()
                    expect(posts.length).toBeGreaterThan(0)
                    expect(posts[0]).toHaveProperty("id")
                }
            })

            test("searchTags(\"a\")", async () => {
                test.failingIf(extension.searchTags === undefined)
                let tags: Tag[] = []
                expect(async () => tags = await extension.searchTags("a"))
                    .not.toThrow()
                expect(tags.length).toBeGreaterThan(0)
                expect(tags[0]).toHaveProperty("name")
            })
        })
    }
})