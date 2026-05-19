export enum Errors {
    Fetch = "Fetch",
    Parse = "Parse",
    Auth = "Auth",
    RateLimit = "RateLimit",
    Unknown = "Unknown"
}

export class ExtensionError extends Error {
    code: Errors
    description?: string
    constructor(code: Errors, message?: string, description?: string) {
        super(message)
        this.name = "ExtensionError"
        this.description = description
        this.code = code
    }

    override toString() {
        return JSON.stringify(this)
    }
}
