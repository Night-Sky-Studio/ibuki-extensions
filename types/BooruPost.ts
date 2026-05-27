export type Tag = {
    name: string
    displayName?: string
    antecedentName?: string
    category: string

    /** Optional count of how many posts are associated with this tag */
    count?: number
}

export interface ImageUrls {
    original: string
    preview: string
    medium?: string
    large?: string
    xlarge?: string
}

export enum TagCategory {
    copyright = "copyright",
    character = "character",
    species = "species",
    artist = "artist",
    contributor = "contributor",
    lore = "lore",
    general = "general",
    meta = "meta"
}

export type PostTags = Record<string, Tag[]>

export interface PostScore {
    upVotes: number
    downVotes: number
    favoritesCount: number
}

export interface PostInformation {
    uploaderId?: number
    score?: PostScore
    sources?: string[]
    parentId?: number
    hasChildren?: boolean
    createdAt?: string
    updatedAt?: string
    rating?: string
    fileExtension?: string
    fileSize?: number
    imageWidth: number
    imageHeight: number
}

export interface PostFlags {
    isDeleted: boolean
    isPending: boolean
    isFlagged: boolean
}

export interface BooruPost {
    id: number
    image: ImageUrls
    directUrl: string
    flags: PostFlags
    tags: Partial<PostTags>
    information?: PostInformation
}