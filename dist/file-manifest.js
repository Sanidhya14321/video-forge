import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
/** Hash media with bounded memory, including recordings larger than the JS heap. */
export async function fingerprint(file) {
    const hash = createHash('sha256');
    let bytes = 0;
    for await (const chunk of createReadStream(file)) {
        bytes += chunk.length;
        hash.update(chunk);
    }
    return { bytes, sha256: hash.digest('hex') };
}
