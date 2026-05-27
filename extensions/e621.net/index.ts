import { Errors, ExtensionError, TagCategory, url, USER_AGENT, type BooruPost, type Extension, type Tag } from "types"
import type { E621Post, TagQuery } from "./types"

const BASE_URL = "https://e621.net"
const TAG_SPACE = "_"

const mapTag = (tag: string, category: string): Tag => ({
    name: tag,
    displayName: tag.replaceAll(TAG_SPACE, " "),
    category: category
})

function mapPost(post: E621Post): BooruPost | null {
    if (
        post.files.original.url === undefined ||
        post.files.preview.jpg === undefined ||
        post.files.sample.jpg === undefined
    ) {
        return null
    }
    
    return {
        id: post.id,
        directUrl: url({ base: BASE_URL, path: `posts/${post.id}` }),
        flags: {
            isDeleted: post.flags.deleted,
            isPending: post.flags.pending,
            isFlagged: post.flags.flagged,
        },
        image: {
            original: post.files.original.url,
            preview: post.files.preview.jpg,
            large: post.files.sample.jpg
        },
        tags: {
            [TagCategory.artist]: post.tags.artist.map(t => mapTag(t, "artist")),
            [TagCategory.contributor]: post.tags.contributor.map(t => mapTag(t, "contributor")),
            [TagCategory.character]: post.tags.character.map(t => mapTag(t, "character")),
            [TagCategory.copyright]: post.tags.copyright.map(t => mapTag(t, "copyright")),
            [TagCategory.species]: post.tags.species.map(t => mapTag(t, "species")),
            [TagCategory.general]: post.tags.general.map(t => mapTag(t, "general")),
            [TagCategory.meta]: post.tags.meta.map(t => mapTag(t, "meta")),
            [TagCategory.lore]: post.tags.lore.map(t => mapTag(t, "lore")),
            invalid: post.tags.invalid.map(t => mapTag(t, "invalid")),
        },
        information: {
            uploaderId: post.uploader_id,
            score: {
                upVotes: post.stats.score.up,
                downVotes: post.stats.score.down,
                favoritesCount: post.stats.fav_count
            },
            sources: post.sources,
            parentId: post.relationships.parent_id ?? undefined,
            hasChildren: post.relationships.children.length > 0,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
            rating: post.rating,
            fileExtension: post.files.meta.ext,
            fileSize: post.files.meta.size,
            imageWidth: post.files.original.width,
            imageHeight: post.files.original.height,
        }
    }
}

async function getPosts({ page = 1, limit = 20, search = "", auth = ":"}): Promise<BooruPost[]> {
    const authHeader = auth !== ":" ? `Basic ${btoa(auth)}` : ""

    const response = await fetch(url({
        base: BASE_URL,
        path: "posts.json",
        query: {
            "page": `${page}`,
            "limit": `${limit}`,
            "tags": search,
            "v2": "true",
            "mode": "extended"
        }
    }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
            "Authorization": authHeader
        }
    })

    if (!response.ok) {
        throw new ExtensionError(Errors.Fetch, 
            `Failed to fetch posts: ${response.status}`,
            await response.text())
    }

    let json = await response.json() as E621Post[]

    return json.map(p => mapPost(p))
        .filter(p => p !== null)
}

function getTagCategory(category: number) {
    switch (category) {
        case 0: return "general"
        case 1: return "artist"
        case 2: return "contributor"
        case 3: return "copyright"
        case 4: return "character"
        case 5: return "species"
        case 6: return "invalid"
        case 7: return "meta"
        case 8: return "lore"
        default: return "unknown"
    }
}

const mapTagQuery = (tag: TagQuery): Tag => ({
    name: tag.name,
    displayName: tag.name.replaceAll(TAG_SPACE, " "),
    antecedentName: tag.antecedent_name ?? undefined,
    category: getTagCategory(tag.category)
})

async function searchTags(query: string): Promise<Tag[]> {
    if (query.length <= 2) return [] // e621 returns "bad request" for < 2 characters
    const response = await fetch(url({
        base: BASE_URL,
        path: "tags/autocomplete.json",
        query: {
            "search[name_matches]": query
        }
    }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT
        }
    })
    const json = await response.json() as TagQuery[]

    return json.map(mapTagQuery)
}

export async function getUserFavorites({ username = "", ...params }): Promise<BooruPost[]> {
    return getPosts({ ...params, search: `fav:${params.username} ${params.search ?? ""}` })
}

export async function getPostChildren({ parentId = 0, ...params }): Promise<BooruPost[]> {
    return getPosts({ ...params, search: `parent:${parentId} ${params.search ?? ""}` })
}

export default {
    name: "e621.net",
    baseUrl : BASE_URL,
    nsfw: true,
    rateLimit: 500, // 2 requests per second
    version: "1.0.5",

    getPosts,
    getUserFavorites,
    getPostChildren,
    searchTags
} satisfies Extension