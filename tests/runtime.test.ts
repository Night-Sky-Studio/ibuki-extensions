import Bun from "bun"
import { describe, test, expect } from "bun:test"

describe("Runtime tests", () => {
    test("DOMParser is available", () => {
        expect(DOMParser).toBeDefined()
    })

    test("fetch is available", () => {
        expect(fetch).toBeDefined()
        expect(fetch).toBe(Bun.fetch)    
    })
})