/// <reference path="../API.d.ts" />

const Extension = {
    name: "Derpibooru",
    kind: "nsfw",
    api_type: "json",
    base_url: "https://derpibooru.org",
    tags_separator: ", ",
    rate_limit: 10,
    network_access: true,
    version: "1.0.0.0",
    icon: "https://derpibooru.org/favicon-1d9b18a7f91980befac934757ed800f5.svg?vsn=d"
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
            || isNullOrUndefined(json.representations) 
            || isNullOrUndefined(json.representations.thumb) 
            || isNullOrUndefined(json.representations.large)
            || isNullOrUndefined(json.representations.full) 
        ) 
            return null
        
        return {
            ID: json.id,
            PreviewFileURL: json.representations.thumb,
            LargeFileURL: json.representations.large,
            OriginalFileURL: json.representations.full,
            DirectURL: url({base: Extension.base_url, path: `images/${json.id}`}),
            Tags: {
                CopyrightTags: null,
                CharacterTags: null,
                SpeciesTags: null,
                ArtistTags: null,
                LoreTags: null,
                GeneralTags: ProcessTags(json.tags, "", "general"),
                MetaTags: null
            },
            Information: {
                UploaderID: json.uploader_id,
                Score: {
                    UpVotes: json.upvotes,
                    DownVotes: json.downvotes,
                    FavoritesCount: json.faves,
                },
                Source: json.source_urls.length > 0 ? json.source_urls[0] : null,
                ParentID: null,
                HasChildren: null,
                IsPending: isNullOrUndefined(json.processed) ? null : !json.processed,
                CreatedAt: json.created_at,
                UploadedAt: json.updated_at,
                Rating: null,
                FileExtension: json.format,
                FileSize: json.size,
                ImageWidth: json.width,
                ImageHeight: json.height,
            }
        }
    } catch (_) {
        return null
    }
}
 
function ParsePostsJSON(json) {
    let result = []
    let array = JSON.parse(json_string)
    
    for (let i = 0; i < array.length; i++) {
        let post = ParsePostJSON(array[i])
        if (post != null)
            result.push(post)
    }   
    
    return result
}

function ConvertTagCategory(category) {
    switch (category) {
        case null: case "null": return "general"
        case "origin": case 1: return "artist"
        // case "": case 3: return "copyright"
        case "character": case "oc": return "character"
        case "species": return "species"
        case "error": case "spoiler": case 5: return "meta"
        default: return "general"
    }
}

function ParseTagJSON(json) {
    try {
        if (typeof(json) !== typeof(JSON)) json = JSON.parse(json) 

        return {
            Name: json.name,
            DisplayName: json.name,
            Category: ConvertTagCategory(json.category),
        }

    } catch (_) {
        return null
    }
}

/// Main implementation 

async function GetPosts({page = 1, limit = 20, search = "", auth = ":"}) {
    // const user = {
    //     name: auth.split(":")[0],
    //     key: auth.split(":")[1]
    // }
    let posts = await (await fetch(url({
        base: Extension.base_url,
        path: "api/v1/json/search/images",
        query: [
            { "page": page },
            { "per_page": limit },
            { "q": search },
            // { "login": user.name },
            // { "api_key": user.key }
        ]
    }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": UserAgent
        }
    })).json()

    posts = posts.images
    
    let result = []
    for (let i = 0; i < posts.length; i++) {
        let post = ParsePostJSON(posts[i])
        if (post != null)
            result.push(post)
    }
    return JSON.stringify(result)
}

async function GetUserFavorites({page = 1, limit = 20, username = "", auth = ":"}) {
    return await GetPosts({page: page, limit: limit, search: `faved_by:${username}`, auth: auth})
}

async function GetPostChildren({id = 0, auth = ":"}) {
    // return await GetPosts({page: 1, limit: 200, search: `parent:${id} -id:${id}`, auth: auth})
    return null
}

// Page is not included, since having page switching for a 
// tag search bar is too cumbersome...
async function GetTagSuggestion({search = "", limit = 20, auth = ":"}) {
    // const user = {
    //     name: auth.split(":")[0],
    //     key: auth.split(":")[1]
    // }
    let tags = await (await fetch(url({
        base: Extension.base_url,
        path: "api/v1/json/search/tags",
        query: [
            { "q": `*${search}*` },
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