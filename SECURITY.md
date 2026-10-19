# Security and privacy

Video Forge runs code and media tools with the permissions of its agent host. Review the package and its dependencies before use. Local production does not send media to a Video Forge server; this repository operates no hosted service. Installing dependencies, browser/model weights and optional cloud generation can make network requests.

OpenAI/fal adapters send selected text/media requests to the configured provider only when enabled and budgeted. Do not store API keys in jobs, prompts, logs, release archives or issue reports. Keep private media and output artifacts in the user's workspace. Asset manifests preserve provenance, not permission to redistribute a file.

The client budget reserves estimated spend; it is not an account-wide provider billing cap. Failed/ambiguous requests can still cost money. Inspect preserved request IDs before retrying. Source PDFs and upstream skill text are untrusted research inputs, never installation or execution authorization.

Report sensitive vulnerabilities through GitHub's private vulnerability reporting where available; avoid public issues containing secrets or private files. If that channel is unavailable, use the repository owner's GitHub profile to arrange a private report without posting the sensitive payload. Only the latest release receives fixes; older tags remain available for reproducibility. No security audit or guaranteed response time is claimed.
