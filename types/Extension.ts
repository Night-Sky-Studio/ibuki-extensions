import type { BooruPost, Tag } from "./BooruPost"

export interface BaseQueryParams {
    limit: number
    search: string
    auth: string
}

export interface PostQueryParams extends BaseQueryParams {
    page: number
}

export interface FavoritesQueryParams extends Omit<PostQueryParams, "search"> {
    username: string
}


export interface Extension {
    name: string
    baseUrl: string
    nsfw: boolean
    rateLimit: number
    version: string

    getPosts?:          (p: BaseQueryParams & { search:   string }) => Promise<BooruPost[]>
    getUserFavorites?:  (p: BaseQueryParams & { username: string }) => Promise<BooruPost[]>
    getPostChildren?:   (p: BaseQueryParams & { parentId: number }) => Promise<BooruPost[]>
    searchTags?:        (query: string) => Promise<Tag[]>
}