export const USER_AGENT = "Ibuki/1.0.0 (by LilyStilson on GitHub)"

export interface UrlParams {
    base: string,
    path?: string,
    query?: Record<string, string | undefined>
} 

export function url({ base, path, query }: UrlParams): string {
    let result = ""
    if (base) {
        result += base
        if (!base.endsWith("/")) {
            result += "/"
        }
    }
    if (path) {
        if (path.startsWith("/")) {
            result += path.substring(1)
        } else {
            result += path
        }

        if (path.endsWith("/")) {
            result = result.slice(0, -1)
        }
    }
    if (query) {
        const params = Object.entries(query)
            .filter(([, value]) => value !== undefined && value !== "")
            .map(([key, value]) => 
                `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
            )
            .join("&")
        if (params) {
            result += `?${params}`
        }
    }
    return result
}