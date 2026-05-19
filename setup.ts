import { DOMParser as XMLDOM } from "@xmldom/xmldom"
import Bun from "bun"

declare global {
    var DOMParser: typeof XMLDOM
}

globalThis.DOMParser = XMLDOM
globalThis.fetch = Bun.fetch