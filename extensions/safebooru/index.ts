import type { Extension } from "types"

import { 
    getPosts, 
    getUserFavorites, 
    getPostChildren, 
    searchTags 
} from "../danbooru"

const BASE_URL = "https://safebooru.donmai.us"

export default {
    name: "Safebooru",
    baseUrl : BASE_URL,
    nsfw: false,
    rateLimit: 10,
    version: "1.0.5",

    getPosts,
    getUserFavorites,
    getPostChildren,
    searchTags
} satisfies Extension