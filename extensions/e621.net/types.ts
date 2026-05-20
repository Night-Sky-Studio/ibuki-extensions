export interface E621Post {
    id: number
    created_at: string
    updated_at: string
    change_seq: number
    files: Files
    uploader_id: number
    uploader_name: string
    approver_id: number | null
    stats: Stats
    flags: Flags
    has: Has
    relationships: Relationships
    pools: string[]
    rating: string
    locked_tags: string[]
    sources: string[]
    description: string
    tags: Tags
}

export interface Files {
    meta: Meta
    original: Original
    preview: Preview
    sample: Sample
}

export interface Meta {
    md5: string
    ext: string
    size: number
    duration: number | null
    has_sample: boolean
}

export interface Original {
    width: number
    height: number
    url: string
}

export interface Preview {
    width: number
    height: number
    jpg: string
    webp: string
}

export interface Sample {
    width: number
    height: number
    jpg: string
    webp: string
}

export interface Stats {
    score: Score
    fav_count: number
    is_favorited: boolean
    comment_count: number
}

export interface Score {
    up: number
    down: number
    total: number
}

export interface Flags {
    pending: boolean
    flagged: boolean
    note_locked: boolean
    status_locked: boolean
    rating_locked: boolean
    deleted: boolean
}

export interface Has {
    parent: boolean
    children: boolean
    active_children: boolean
    notes: boolean
    sample: boolean
}

export interface Relationships {
    parent_id: number | null
    children: number[]
}

export interface Tags {
    general: string[]
    artist: string[]
    contributor: string[]
    copyright: string[]
    character: string[]
    species: string[]
    invalid: string[]
    meta: string[]
    lore: string[]
}

export interface TagQuery {
    id: number
    name: string
    post_count: number
    category: number
    antecedent_name: string | null
}