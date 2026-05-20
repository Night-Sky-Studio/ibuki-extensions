import { Errors, ExtensionError, USER_AGENT, type BooruPost } from "types"
import { type Extension, type Tag, url } from "types"
import type { DanbooruPost, TagQuery } from "./types"

const BASE_URL = "https://danbooru.donmai.us"
const TAG_SEPARATOR = " "
const TAG_SPACE = "_"

const mapTag = (tag: string, category: string): Tag => ({
    name: tag,
    displayName: tag.replaceAll(TAG_SPACE, " "),
    category: category
})

function mapPost(post: DanbooruPost): BooruPost | null {
    if (
        post.file_url === undefined ||
        post.preview_file_url === undefined ||
        post.large_file_url === undefined
    ) {
        return null
    }

    return {
        id: post.id,
        directUrl: url({ base: BASE_URL, path: `posts/${post.id}` }),
        flags: {
            isDeleted: post.is_deleted,
            isPending: post.is_pending,
            isFlagged: post.is_flagged
        },
        image: {
            original: post.file_url,
            preview: post.preview_file_url,
            large: post.large_file_url
        },
        tags: {
            copyright: post.tag_string_copyright
                .split(TAG_SEPARATOR).map(t => mapTag(t, "copyright")),
            character: post.tag_string_character
                .split(TAG_SEPARATOR).map(t => mapTag(t, "character")),
            artist: post.tag_string_artist
                .split(TAG_SEPARATOR).map(t => mapTag(t, "artist")),
            general: post.tag_string_general
                .split(TAG_SEPARATOR).map(t => mapTag(t, "general")),
            meta: post.tag_string_meta
                .split(TAG_SEPARATOR).map(t => mapTag(t, "meta"))
        },
        information: {
            imageWidth: post.image_width,
            imageHeight: post.image_height,
            fileExtension: post.file_ext,
            fileSize: post.file_size,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
            score: {
                upVotes: post.up_score,
                downVotes: post.down_score,
                favoritesCount: post.fav_count
            },
            rating: post.rating,
            sources: [post.source],
            hasChildren: post.has_children,
            parentId: post.parent_id ?? undefined,
            uploaderId: post.uploader_id
        }
    }
}

const shouldIgnoreFlags = (search: string) => search.includes("is:deleted")

export async function getPosts({ 
    page = 1, 
    limit = 20, 
    search = "", 
    auth = "" 
}): Promise<BooruPost[]> {
    const [user, apiKey] = auth.split(":")

    let response = await fetch(url({
        base: BASE_URL,
        path: "posts.json",
        query: {
            "page": `${page}`,
            "limit": `${limit}`,
            "tags": search,
            "login": user,
            "api_key": apiKey
        }
    }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT
        }
    })

    if (!response.ok) {
        throw new ExtensionError(Errors.Fetch, 
            `Failed to fetch posts: ${response.status}`,
            await response.text())
    }

    let json = await response.json() as DanbooruPost[]

    return json.map(p => mapPost(p))
        .filter(p => p !== null)
        // If the search query doesn't explicitly include deleted posts, filter them out
        .filter(p => !shouldIgnoreFlags(search) || !p.flags.isDeleted)
}

export async function getUserFavorites({ username = "", ...params }): Promise<BooruPost[]> {
    return getPosts({ ...params, search: `ordfav:${params.username} ${params.search ?? ""}` })
}

export async function getPostChildren({ parentId = 0, ...params }): Promise<BooruPost[]> {
    return getPosts({ ...params, search: `parent:${parentId} -id:${parentId} ${params.search ?? ""}` })
}

function getTagCategory(category: number): string {
    switch (category) {
        case 0: return "general"
        case 1: return "artist"
        case 3: return "copyright"
        case 4: return "character"
        case 5: return "meta"
        default: return "unknown"
    }
}

const mapTagQuery = (tag: TagQuery): Tag => ({
    name: tag.value,
    displayName: tag.label,
    antecedentName: tag.antecedent ?? undefined,
    category: getTagCategory(tag.category)
})

export async function searchTags(query: string): Promise<Tag[]> {
    const response = await fetch(url({
        base: BASE_URL,
        path: "autocomplete.json",
        query: {
            "search[query]": query,
            "search[type]": "tag_query",
            limit: "20"
        }
    }))

    const json = await response.json() as TagQuery[]

    return json.map(mapTagQuery)
}

export default {
    name: "Danbooru",
    baseUrl : BASE_URL,
    nsfw: true,
    rateLimit: 10,
    version: "1.0.5",

    getPosts,
    getUserFavorites,
    getPostChildren,
    searchTags
} satisfies Extension
