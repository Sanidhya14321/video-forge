# Narration and audio preparation

## Local voice
Run the locked optional Python environment with Python 3.11. Kokoro loads its model weights on first use; local inference still requires network access for initial downloads and sufficient memory. `af_heart` is the default English voice. The helper supports Kokoro's language-code mapping; verify that the selected voice matches the language.

Prepare a speakable script, generate it, and probe its actual duration. Extend scenes or shorten copy if it exceeds the planned film. Avoid time-stretching technical speech merely to fit a rigid template. Keep generated WAV and narration text as editable production assets. Generated speech is normalized with measured two-pass FFmpeg loudnorm toward -16 LUFS / -1.5 dBTP before staging; the original WAV is preserved.

For recognition, faster-whisper uses CPU int8 inference and produces word timings. Language detection is not assumed when a project specifies its language. Review pronunciation and transcript of identifiers such as SQL, O(n), framework names, and version strings.

## OpenAI speech adapter
Set `OPENAI_API_KEY` in the execution environment, select `openai`, use a supported per-character speech model, and specify a verified `rateUsdPerMillionCharacters`. The runner reserves that estimate plus ten percent before the HTTP call. It records ambiguous failures without releasing the reservation. It does not query account billing or enforce an account-wide cap.

The adapter produces WAV audio. It does not create or clone voices. Use an available built-in voice, and disclose AI-generated narration in publishing copy. Live API behavior must be verified separately from transport mocks.

## Mix
Music is an optional local asset with its own volume. It loops under the film; the renderer applies additional attenuation while timestamped caption words are active. If there are no aligned words, there is no speech-aware attenuation. Long speech gaps may require a manually directed mix rather than this simple rule.

Listen to consonants against music at a realistic playback level. For target loudness, measure with FFmpeg `loudnorm` or `ebur128` and apply a deliberate mastering pass; do not report a target based only on volume settings. Keep music licensing and any sample attribution separate from the repository license.

Hosted music, multilingual commercial TTS, automatic sound design, and voice cloning remain provider-specific reference workflows. Use approved local audio when those integrations are unavailable.

## Entry-level source mapping

Read [catalog.md](catalog.md) only when a particular upstream technique or its provenance matters.
