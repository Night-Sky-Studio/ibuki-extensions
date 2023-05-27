declare export enum ExtensionKind {
    SFW = "sfw", 
    NSFW = "nsfw"
}

declare export enum ExtensionType {
    XML = "xml", 
    JSON = "json"
}

declare export type Extension = {
    name: String;
    kind: ExtensionKind;
    api_type: ExtensionType;
    base_url: String;
    tags_separator: String;
    rate_limit: Number;
    network_access: boolean;
    /// The icon of the extension. Can be a URL or a base64 string.
    icon: String;
}

declare export enum TagType {
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

declare export type Tag = {
    Name: string;
    DisplayName: string?;
    Type: TagType;
}

declare export type Post = {
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
        UploaderID: number?;
        Score: {
            UpVotes: number;
            DownVotes: number;
            FavoritesCount: number;
        } | null;
        Source: string?;
        ParentID: number?;
        HasChildren: boolean?;
        CreatedAt: string | any | null;
        UploadedAt: string | any | null;
        FileExtension: string?;
        FileSize: number?;
        ImageWidth: number?;
        ImageHeight: number?;
    };
}

declare export function url(params: { 
    base: String,
    path: String,
    query: Array<{ key: String, value: any }> 
}): String

declare export const UserAgent = "Aster/1.0.0 Ibuki/1.0.0"

declare function MakeTagsFromTagsString(str: String, separator: String): String[];

declare function ParsePostJSON(json: String | JSON): Post?;

declare function ConvertTagCategory(category: String): TagType;

declare async function GetPosts({ page, limit, search, auth }: {
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    auth?: string | undefined;
} | null): Promise<string>;

declare async function GetTagSuggestion({ search, limit } : { 
    search?: String | undefined;
    limit?: Number | undefined;
} | null): Promise<string>;

// declare function ParsePostsJSON(json: String | JSON): Post[]?;