/// <reference path="../API.d.ts" />

const Extension = {
    name: "Konachan",
    kind: "nsfw",
    api_type: "json",
    base_url: "https://konachan.com/",
    tags_separator: " ",
    rate_limit: 10,
    network_access: true,
    version: "1.0.0.1",
    icon: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://konachan.net&size=32"
}

/// Helpers
function ProcessTags(source, separator, space, type) {
    if (source == null || source == undefined || source.length == 0) return null

    return source.split(separator).map((tag) => { 
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
            || isNullOrUndefined(json.file_url)
            || isNullOrUndefined(json.preview_url)
            || isNullOrUndefined(json.sample_url)
            || json.status == "deleted" 
            || json.status == "flagged"
            || json.is_held
        ) 
            return null

        return {
            ID: json.id,
            PreviewFileURL: json.preview_url,
            LargeFileURL: json.sample_url,
            OriginalFileURL: json.file_url,
            DirectURL: url({base: Extension.base_url, path: `post/show/${json.id}`}),
            Tags: {
                CopyrightTags:  null,
                CharacterTags:  null,
                SpeciesTags:    null,
                ArtistTags:     null,
                LoreTags:       null,
                GeneralTags:    ProcessTags(json.tags, Extension.tags_separator, "_", "general"),
                MetaTags:       null
            },
            Information: {
                UploaderID: json.creator_id,
                Score: {
                    UpVotes: json.score,
                    DownVotes: 0,
                    FavoritesCount: 0,
                },
                Source: encodeURI(json.source),
                ParentID: json.parent_id,
                HasChildren: json.has_children,
                IsPending: json.is_held,
                CreatedAt: json.created_at,
                UploadedAt: null,
                Rating: json.rating,
                FileExtension: json.file_url.split(".").pop(),
                FileSize: json.file_size,
                ImageWidth: json.width,
                ImageHeight: json.height,
            }
        }
    } catch (e) {
        console.log("Failed to parse post JSON: " + json.id)
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
        path: "post.json",
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
        path: "tag.json",
        query: [
            { "name_pattern": `${search}*` },
            { "limit": limit },
            { "order": "count" },
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