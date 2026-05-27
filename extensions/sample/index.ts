import { type BooruPost, Errors, type Extension, ExtensionError, type Tag, url, USER_AGENT } from "types"
import { mapPost } from "../danbooru"
import type { DanbooruPost } from "../danbooru/types"

export const IGNORE_TESTS = true

const EXAMPLE_POST: BooruPost = {
    "id": 2439660,
    "directUrl": "https://danbooru.donmai.us/posts/2439660",
    "flags": {
        "isDeleted": false,
        "isPending": false,
        "isFlagged": false
    },
    "image": {
        "original": "https://cdn.donmai.us/original/b8/fa/b8fa783a125164a54a0c68379b292c04.png",
        "preview": "https://cdn.donmai.us/180x180/b8/fa/b8fa783a125164a54a0c68379b292c04.jpg",
        "large": "https://cdn.donmai.us/original/b8/fa/b8fa783a125164a54a0c68379b292c04.png"
    },
    "tags": {
        "copyright": [
            {
                "name": "fate/grand_order",
                "displayName": "fate/grand order",
                "category": "copyright"
            },
            {
                "name": "fate_(series)",
                "displayName": "fate (series)",
                "category": "copyright"
            }
        ],
        "character": [
            {
                "name": "artoria_pendragon_(fate)",
                "displayName": "artoria pendragon (fate)",
                "category": "character"
            },
            {
                "name": "artoria_pendragon_(lancer)_(fate)",
                "displayName": "artoria pendragon (lancer) (fate)",
                "category": "character"
            },
            {
                "name": "artoria_pendragon_(lancer)_(third_ascension)_(fate)",
                "displayName": "artoria pendragon (lancer) (third ascension) (fate)",
                "category": "character"
            },
            {
                "name": "lion_king_(lancer)_(fate)",
                "displayName": "lion king (lancer) (fate)",
                "category": "character"
            }
        ],
        "artist": [
            {
                "name": "arrow_(tamawo222)",
                "displayName": "arrow (tamawo222)",
                "category": "artist"
            }
        ],
        "general": [
            {
                "name": "1girl",
                "displayName": "1girl",
                "category": "general"
            },
            {
                "name": "ahoge",
                "displayName": "ahoge",
                "category": "general"
            },
            {
                "name": "blonde_hair",
                "displayName": "blonde hair",
                "category": "general"
            },
            {
                "name": "braid",
                "displayName": "braid",
                "category": "general"
            },
            {
                "name": "breasts",
                "displayName": "breasts",
                "category": "general"
            },
            {
                "name": "cape",
                "displayName": "cape",
                "category": "general"
            },
            {
                "name": "cleavage",
                "displayName": "cleavage",
                "category": "general"
            },
            {
                "name": "covered_navel",
                "displayName": "covered navel",
                "category": "general"
            },
            {
                "name": "gauntlets",
                "displayName": "gauntlets",
                "category": "general"
            },
            {
                "name": "green_eyes",
                "displayName": "green eyes",
                "category": "general"
            },
            {
                "name": "large_breasts",
                "displayName": "large breasts",
                "category": "general"
            },
            {
                "name": "long_hair",
                "displayName": "long hair",
                "category": "general"
            },
            {
                "name": "looking_at_viewer",
                "displayName": "looking at viewer",
                "category": "general"
            },
            {
                "name": "sleeveless",
                "displayName": "sleeveless",
                "category": "general"
            },
            {
                "name": "sleeveless_turtleneck",
                "displayName": "sleeveless turtleneck",
                "category": "general"
            },
            {
                "name": "smile",
                "displayName": "smile",
                "category": "general"
            },
            {
                "name": "solo",
                "displayName": "solo",
                "category": "general"
            },
            {
                "name": "thighhighs",
                "displayName": "thighhighs",
                "category": "general"
            },
            {
                "name": "turtleneck",
                "displayName": "turtleneck",
                "category": "general"
            }
        ],
        "meta": [
            {
                "name": "bad_id",
                "displayName": "bad id",
                "category": "meta"
            },
            {
                "name": "bad_pixiv_id",
                "displayName": "bad pixiv id",
                "category": "meta"
            }
        ]
    },
    "information": {
        "imageWidth": 720,
        "imageHeight": 1116,
        "fileExtension": "png",
        "fileSize": 1033675,
        "createdAt": "2016-08-01T00:36:52.602+10:00",
        "updatedAt": "2025-07-02T15:35:53.870+10:00",
        "score": {
            "upVotes": 35,
            "downVotes": 0,
            "favoritesCount": 77
        },
        "rating": "s",
        "sources": [
            "http://i3.pixiv.net/img-original/img/2016/07/31/23/34/39/58184910_p0.png"
        ],
        "hasChildren": false,
        "uploaderId": 30072
    }
}

async function getExamplePost() {
    const response = await fetch(url({
        base: "https://safebooru.donmai.us",
        path: "posts/4534897.json",
    }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT
        }
    })

    if (!response.ok) {
        throw new ExtensionError(Errors.Fetch, 
            `Failed to fetch post 4534897: ${response.status}`,
            await response.text())
    }

    const post: DanbooruPost = await response.json() as DanbooruPost
    return mapPost(post) as BooruPost
}

export default {
    name: "Test Extension",
    baseUrl : "https://example.com",
    nsfw: false,
    rateLimit: 0,
    version: "1.0.0",

    getPosts: async () => [EXAMPLE_POST, await getExamplePost()],
    getUserFavorites: async () => [EXAMPLE_POST],
    getPostChildren : async () => [],
    searchTags: async () => [{
        name: "example_tag",
        displayName: "example tag",
        category: "general",
        antecedentName: "example",
        count: 1337
    }] satisfies Tag[],
} satisfies Extension
