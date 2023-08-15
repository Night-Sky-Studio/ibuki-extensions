export enum ExtensionKind {
    SFW = "sfw", 
    NSFW = "nsfw"
}

export enum ExtensionType {
    XML = "xml", 
    JSON = "json"
}

export type Extension = {
    name: string;
    kind: ExtensionKind;
    api_type: ExtensionType;
    base_url: string;
    tags_separator: string;
    rate_limit: number;
    network_access: boolean;
    version: string;
    /// The icon of the extension. Can be a URL or a base64 string.
    icon: string;
}

export enum TagType {
    General = "general",
    Artist = "artist",
    Copyright = "copyright",
    Character = "character",
    Meta = "meta",
    Lore = "lore",
    Species = "species",
    Pool = "pool",
    Unknown = "unknown",
}

export type Tag = {
    Name: string;
    DisplayName?: string;
    Type: TagType;
}

export type Post = {
    ID: number;
    PreviewFileURL: string;
    LargeFileURL: string;
    OriginalFileURL: string,
    DirectURL: string;
    Tags: {
        CopyrightTags: Tag[] | null;
        CharacterTags: Tag[] | null;
        SpeciesTags: Tag[] | null;
        ArtistTags: Tag[] | null;
        LoreTags: Tag[] | null;
        GeneralTags: Tag[] | null;
        MetaTags: Tag[] | null;
    };
    Information: {
        UploaderID?: number;
        Score: {
            UpVotes: number;
            DownVotes: number;
            FavoritesCount: number;
        } | null;
        Source?: string;
        ParentID?: number;
        HasChildren?: boolean;
        CreatedAt: string | any | null;
        UploadedAt: string | any | null;
        FileExtension?: string;
        FileSize?: number;
        ImageWidth?: number;
        ImageHeight?: number;
    };
}

export function url(params: { 
    base: string,
    path: string,
    query: Array<{ key: string, value: any }> 
}): string

export const UserAgent = "Aster/1.0.0 Ibuki/1.0.0"

export function MakeTagsFromTagsString(str: string, separator: string): string[];

export function ParsePostJSON(json: string | JSON): Post | undefined;

export function ConvertTagCategory(category: string): TagType;

export function GetPosts({ page, limit, search, auth }: {
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    auth?: string | undefined;
} | null): Promise<string>;

export function GetTagSuggestion({ search, limit } : { 
    search?: string | undefined;
    limit?: number | undefined;
} | null): Promise<string>;

// declare function ParsePostsJSON(json: string | JSON): Post[]?;