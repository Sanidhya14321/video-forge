/** Hash media with bounded memory, including recordings larger than the JS heap. */
export declare function fingerprint(file: string): Promise<{
    bytes: number;
    sha256: string;
}>;
