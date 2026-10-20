/** Validate the supported GLB envelope before loading an asset into the renderer.
 * It is a capability/preflight check, not a complete glTF conformance validator. */
export declare function inspectGlb(file: string): Promise<{
    bytes: number;
    meshes: any;
    animations: any;
    scope: string;
}>;
