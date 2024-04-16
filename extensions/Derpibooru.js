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
    icon: "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABUFBMVEUAAACXv9+VwtyUwtyVwd1y1+yTv9uUwd1w1++Uwd1z1e2UwN1y1+101+tz1u1z1u1z1uyW4PK36vbG7vi06fWK3fCv6PXo+Pz////r+fyq5vSY4fLq+fyH3PC76/aw6PXN8Pm+7Pe86/au5/Wd4vL0/P7h9vuP3vGt5/Tz+/34/f6o5fSc4vK46vbE7ve16faS3/GTwt2GyOGEy+WMx+B40+uHyeN70OmAzuePxN901u131+2Q3/HW8/rf9vuO3vH6/v6h5PPU8vn7/v6G3O/9/v+I3PDZ9Prt+v2NxOGp5vR40+ua4fLi9vve9fuB2u+D2++n5fTR8fmo5vSX4PL3/f7n+PzS8vl62O6U4PGf4/OL3fB21+256vaX4fLw+v31/P6e4/N52O7x+/2C2++s5/TA7ffL8Piz6fW97PaF2++O3vCN3vDT8vnC7feR3/FIHwBZAAAAcHRSTlMAIGC/f2BA/yDfn59/QN//v///////////////////////////////////////////53D/////////////////////////////w//j////////////////////////////////////////////////JL/7RgAAAAlwSFlzAAAOxAAADsQBlSsOGwAABdBJREFUeJztW2eD20QQtSyrS5YvwMWhB0JNqCl3AUJCKCEXIAm9d0JJgP//jV3tqu6MtGXkT8yns2Xfe555b3Z2bS0W/8cc4S13A4Ne8FfqkwE9gSUAwyOMIoBbTM/AixIoCcsoiqCXp+QEFlmUqEnIGH4GvTqnTwHL9TAJns+ei0ANFmtyAguO1kuCF1UBvjgu6VOwrOBaBqHAByuwWGzoUyA/cBKKhyvxEK4AI1AW5AwyyaBKgi/xIRPyyEv6FIQ1ZuJ5DT5SgUVRzpCCBjWJmkD6E1NhuSEnsIzUQFt0OUMKPIAA+uJNWdK3w0zBxyRQEZhRhk3gS3HKakDfjPwhAUyD3IdzpGClpABYoVoC5DJU8bkMYCMEnACtDL0EwseSUBGgrIGnWqClECIECGUIZn+sDoIAVTcMkeyP1EEQoJGhp7hPow6SQE6AP5F9JAm5IOAuQ2gFajGTxPf9LFuxWC7DrhDSkrAGbXSLga8DXQIUNWijGo1rAuNbso0kQDsV8AQ0NUFHgSrWkkBJic+x/WZRHn9tQ4BSBBw2nJjH66jxKWsgN2KejgSKhgDdeuDVhc80JBA0BOhqwBVY9ZpQQwJpS4DKiGGD6mlIoEOASgR+W/dsUgKtCchEICwoIpyUQGsCMhEklQVFeJMSCLoESESw6pU9M5AAjQi8vvFCAwnQiKCxYM3HQAIUy0E4NP5EBYI+AXcV+tO+60XaJ+Cswq4FtaIkJtC1oE4MKuBsg5VpAgYVcLZBZJiAYQVcbYCex2IxrICjDRQLTsaGloCpBYEKONmAWzAxesdQgo4ETC0IJcDloMLYgoAEnRqBsQX7C6EzAWMLggmw70Th9Pw9DNWDLgQGY4BGgAmwboWhsQXhBFgTMLcgkgBLAsZjAGwBewLmFpQHQ+Xesfvuf8CZgLkFYwm3f3y73Z540JGAZ23Bh7ZVPPxISyC2IGBuwfpM4FFBYPuYUwYsLFgr8HFJ4KQTAfMxoGkBT0gCT7oQMLdgeyhz6qkK/+lnmmcsWrFxD4rbj1s++xzDf/506UBgZWzBXg8+88KLL73ceWy8HJtbMC/HwngiMrZgMYpvTMB4Ep/AN/7mxtSCU/imBEwtGE/h63fiOC6KIHiFEXhVv3tPfn6dPhQHeVob6SzDP8f/WK83aRoEE/uqcf3rEIjz3l7mPFfg+d77OROYSBxgI0g3xkwQ58Mp7hzDvwD/I04kZ0yKmEcRKO81JhCr+TvgCdD7v9qBmQCAFwk4JCaACBpUzyHDv0iMD2swhut3kRE4IMYHJYCYt7EgZUASwMwbzZAASALAIUYVF3ALjsdrr49c1P/8thZ849J2++Yp7KoqAWwDV1nwrDn+5SvVDPgWclmRALp4HFha8KoYgo8jlxUJFDwCFmm66XVyWwu+Lcfwd8CrE9MQa+l1Rz+0teC7ksB74FWdYUSQsLbgNYH/PnxVA1+QuG5rwXJPEDgCL2rPo9UkfsOKQPnBh2w3fhq+pn1MLCbxAFwh9j86cfXMKIWbt5AL2nuiZjMMUBC73f1RBlhoz8N+uxccTlm3pchv2hDQxe9N4oNB5WNJ4BMLfG0JDs6j4u5qdU098NAO3eFePY/q1OGkJPDpfAmANsNtEm59VuFfmjEB4Ga4VcLe5wz/iy/nSwC2GY6bMnz19TcWn1/bAuhmONbZ9uCh2wNGNsPgzkE3tM9lxs6jXBjorgL8x7Ij51HWDPSPZbwleAdPHegEOR6Ev+idPgCBgvJHdDZmoP0hJc7g29vfHUEdivruCozB9z+wHvnjT8rz9D+rhxn8/Eu1Slz5dXiB/v4WmMFvcp08Nj8+fJ5wRxL4fQf4gyFFxB+SwJ+9Z2e421EyUJriX5LA3R18/ioUBkfqrDYnPsDg3p2///m383g9Lz6/kVGVYhff5vtBs0AO10TMcKcpwABdn2dPf0MBTgLt8jMewBF5Pn/1uxEXva603jG84BCIbzjWm3xXtXeP/wALVztUQkqh3AAAAABJRU5ErkJggg=="
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