/// <reference path="../API.d.ts" />

const Extension = {
    name: "e621",
    kind: "nsfw",
    api_type: "json",
    base_url: "https://e621.net/",
    tags_separator: null,   /* e621 returns tags in arrays already */
    rate_limit: 500,        /* Max 2 requests per second */
    network_access: true,
    version: "1.0.0.2",
    icon: "https://raw.githubusercontent.com/e621ng/e621ng/master/public/mstile-144x144.png?raw=true"
}

/// Helpers
function ProcessTags(source, space, type) {
    if (source == null || source == undefined || source.length == 0) return null

    return source.map((tag) => { 
        return { 
            Name: tag, 
            DisplayName: tag.replaceAll(space, " "), 
            Category: type
        } 
    })
}

function ParsePostJSON(json) {
    const isNullOrUndefined = (property) => property == null || property == undefined

    try {
        if (typeof(json) !== typeof(JSON)) json = JSON.parse(json)
        
        // When the required by Ibuki fields are empty - don't add this post to the returnable array
        if (    
                isNullOrUndefined(json.id) 
            || isNullOrUndefined(json.file) || isNullOrUndefined(json.file.url) 
            || isNullOrUndefined(json.preview) || isNullOrUndefined(json.preview.url)
            || isNullOrUndefined(json.sample) || (json.sample.has && isNullOrUndefined(json.sample.url))
            || json.flags.deleted == true 
            || json.flags.flagged == true
        ) 
            return null
        
        return {
            ID: json.id,
            PreviewFileURL: json.preview.url,
            LargeFileURL: json.sample.has ? json.sample.url : json.file.url,
            OriginalFileURL: json.file.url,
            DirectURL: url({base: Extension.base_url, path: `posts/${json.id}`}),
            Tags: {
                CopyrightTags:  ProcessTags(json.tags.copyright, "_", "copyright"),
                CharacterTags:  ProcessTags(json.tags.character, "_", "character"),
                SpeciesTags:    ProcessTags(json.tags.species, "_", "species"),
                ArtistTags:     ProcessTags(json.tags.artist, "_", "artist"),
                LoreTags:       ProcessTags(json.tags.lore, "_", "lore"),
                GeneralTags:    ProcessTags(json.tags.general, "_", "general"),
                MetaTags:       ProcessTags(json.tags.meta, "_", "meta")
            },
            Information: {
                UploaderID: json.uploader_id,
                Score: {
                    UpVotes: json.score.up,
                    DownVotes: json.score.down,
                    FavoritesCount: json.fav_count,
                },
                Source: json.sources.length > 0 ? json.sources[0] : undefined,
                ParentID: json.relationships.parent_id,
                HasChildren: json.relationships.has_children,
                IsPending: json.flags.pending,
                CreatedAt: json.created_at,
                UploadedAt: json.updated_at,
                Rating: json.rating,
                FileExtension: json.file.ext,
                FileSize: json.file.size,
                ImageWidth: json.file.width,
                ImageHeight: json.file.height,
            }
        }
    } catch (_) {
        return null
    }
}

function ConvertTagCategory(category) {
    switch (category) {
        case "0": case 0: return "general"
        case "1": case 1: return "artist"
        case "3": case 3: return "copyright"
        case "4": case 4: return "character"
        case "5": case 5: return "species"
        case "6": case 6: return "invalid"
        case "7": case 7: return "meta"
        case "8": case 8: return "lore"
        default: return "unknown"
    }
}

function ParseTagJSON(json) {
    try {
        if (typeof(json) !== typeof(JSON)) json = JSON.parse(json) 

        return {
            Name: json.name,
            DisplayName: json.name.replace("_", " "),
            Category: ConvertTagCategory(json.category),
        }

    } catch (_) {
        return null
    }
}

/// Main implementation 

async function GetPosts({page = 1, limit = 20, search = "", auth = ":"}) {
    const user = {
        name: auth.split(":")[0],
        key: auth.split(":")[1]
    }
    let posts = await (await fetch(url({
        base: Extension.base_url,
        path: "posts.json",
        query: [
            { "page": page },
            { "limit": limit },
            { "tags": search },
            { "login": user.name },
            { "api_key": user.key }
        ]
    }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": UserAgent
        }
    })).json()

    posts = posts.posts

    let result = []
    for (let i = 0; i < posts.length; i++) {
        let post = ParsePostJSON(posts[i])
        if (post != null)
            result.push(post)
    }
    return JSON.stringify(result)
}

async function GetUserFavorites({page = 1, limit = 20, username = "", auth = ":"}) {
    return await GetPosts({page: page, limit: limit, search: `fav:${username}`, auth: auth})
}

async function GetPostChildren({id = 0, auth = ":"}) {
    return await GetPosts({page: 1, limit: 200, search: `parent:${id}`, auth: auth})
}

// Page is not included, since having page switching for a 
// tag search bar is too cumbersome...
async function GetTagSuggestion({search = "", limit = 20, auth = ":"}) {
    const user = {
        name: auth.split(":")[0],
        key: auth.split(":")[1]
    }
    let tags = await (await fetch(url({
        base: Extension.base_url,
        path: "tags.json",
        query: [
            { "search[name_matches]": `${search}*` },
            { "limit": limit },
            { "search[order]": "count" },
            { "login": user.name },
            { "api_key": user.key }
        ]
    }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": UserAgent
        }
    })).json()

    let result = []
    for (let i = 0; i < tags.length; i++) {
        let tag = ParseTagJSON(tags[i])
        if (tag != null)
            result.push(tag)
    }
    return JSON.stringify(result)
}