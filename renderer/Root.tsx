import React from "react";
import {
  AbsoluteFill,
  Composition,
  registerRoot,
  Sequence,
  Audio,
  Img,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import type { RenderProps, Scene, Word } from "../src/schema";
import {ReelScene} from "./Reel";
import {PopReelScene} from "./PopReel";
import {reelLayout,captionGroup} from "../src/reel-layout";
import {ProductionOverlays} from "./Overlays";
import {WorldScene} from './World';
import {footageScaleAt} from "../src/footage-layout";
const sample: any = {
  project: {
    fps: 30,
    theme: {
      background: "#0b1020",
      foreground: "#f1f5f9",
      accent: "#68e0cf",
      muted: "#a8b3cc",
      font: "Arial, sans-serif",
    },
    scenes: [],
    narration: { provider: "none" },
    captions: { maxWords: 5 },
  },
  words: [],
  durationFrames: 30,
};
function Panel({
  scene,
  theme,
}: {
  scene: Scene;
  theme: RenderProps["project"]["theme"];
}) {
  const f = useCurrentFrame(),
    { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const enter = spring({
    frame: f,
    fps,
    config: { damping: 22, stiffness: 130 },
  });
  const font = width * (vertical ? 0.065 : 0.044);
  const max = Math.max(...(scene.values ?? [1]), 1);
  return (
    <AbsoluteFill
      style={{
        padding: `${height * 0.1}px ${width * 0.075}px ${height * 0.22}px`,
        justifyContent: "center",
        gap: height * 0.035,
        opacity: interpolate(f, [0, 7], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${(1 - enter) * 24}px)`,
      }}
    >
      {scene.eyebrow && (
        <div
          style={{
            color: theme.accent,
            fontSize: width * 0.021,
            letterSpacing: 3,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {scene.eyebrow}
        </div>
      )}
      {scene.title && (
        <h1
          style={{
            fontSize: font,
            letterSpacing: -font * 0.035,
            lineHeight: 1.12,
            margin: 0,
            maxWidth: "100%",
            overflowWrap: "break-word",
          }}
        >
          {scene.title}
        </h1>
      )}
      {scene.body && (
        <p
          style={{
            fontSize: font * 0.48,
            lineHeight: 1.5,
            color: theme.muted,
            margin: 0,
          }}
        >
          {scene.body}
        </p>
      )}
      {scene.kind === "code" && (
        <pre
          style={{
            margin: 0,
            padding: width * 0.035,
            fontSize: width * (vertical ? 0.032 : 0.024),
            lineHeight: 1.6,
            background: "#141e33",
            border: `1px solid ${theme.accent}55`,
            borderRadius: width * 0.018,
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            fontFamily: "monospace",
          }}
        >
          {scene.code}
        </pre>
      )}
      {["chart", "algorithm"].includes(scene.kind) && (
        <div
          style={{
            display: "flex",
            height: height * 0.26,
            alignItems: "end",
            gap: width * 0.018,
            paddingTop: 30,
          }}
        >
          {scene.values!.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "end",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontSize: width * 0.025, color: theme.foreground }}>
                {v}
              </div>
              <div
                style={{
                  width: "100%",
                  height: `${Math.max(4, (v / max) * 80 * interpolate(f, [i * 3, i * 3 + 18], [0.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}%`,
                  borderRadius: "8px 8px 0 0",
                  background: scene.highlight?.includes(i)
                    ? "#fbba72"
                    : theme.accent,
                  boxShadow: scene.highlight?.includes(i)
                    ? "0 0 25px #fbba7233"
                    : undefined,
                }}
              />
              <div style={{ fontSize: width * 0.018, color: theme.muted }}>
                {scene.labels?.[i] ??
                  (scene.kind === "algorithm" ? `[${i}]` : "")}
              </div>
            </div>
          ))}
        </div>
      )}
      {scene.kind === "image" && (
        <Img
          src={staticFile(scene.src!)}
          style={{
            width: "100%",
            maxHeight: height * 0.42,
            objectFit: "contain",
            borderRadius: width * 0.02,
            boxShadow: "0 20px 90px #0006",
          }}
        />
      )}
      {scene.kind === "video" && (
        <OffthreadVideo
          src={staticFile(scene.src!)}
          muted
          style={{
            width: "100%",
            maxHeight: height * 0.45,
            objectFit: "contain",
          }}
        />
      )}
      {scene.note && (
        <div
          style={{
            fontSize: font * 0.37,
            color: theme.accent,
            lineHeight: 1.5,
          }}
        >
          {scene.note}
        </div>
      )}
    </AbsoluteFill>
  );
}
function Captions({
  words,
  maxWords,
  theme,
  reel,
}: {
  words: Word[];
  maxWords: number;
  reel?: RenderProps["project"]["reel"];
  theme: RenderProps["project"]["theme"];
}) {
  const f = useCurrentFrame(),
    { fps, width, height } = useVideoConfig(),
    t = f / fps;
  const index = words.findIndex((w) => t >= w.start && t < w.end);
  if (index < 0) return null;
  const {start,end}=captionGroup(words,index,maxWords);
  return (
    <div
      style={{
        position: "absolute",
        left: "8%",
        right: "8%",
        zIndex: 30,
        bottom: reel ? height-reelLayout(width,height,reel.safeArea).caption.y-reelLayout(width,height,reel.safeArea).caption.height : height * 0.14,
        ...(reel ? {left:reelLayout(width,height,reel.safeArea).caption.x, right:width-reelLayout(width,height,reel.safeArea).caption.x-reelLayout(width,height,reel.safeArea).caption.width} : {}),
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 .27em",
          background: reel ? "#111111" : "#070c17ed",
          border: reel?.captionStyle === "brand" ? `3px solid ${theme.accent}` : reel?.captionStyle === "pop" ? "3px solid #fff7e5" : `1px solid ${theme.accent}44`,
          borderRadius: width * 0.016,
          padding: `${height * 0.012}px ${width * 0.025}px`,
          fontSize: reel ? Math.min(width*.039,height*.035) : width * (height > width ? 0.05 : 0.032),
          lineHeight: 1.4,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {words.slice(start, end).map((w, i) => (
          <span
            key={start + i}
            style={{
              color: reel ? (start+i===index?(reel.captionStyle === "brand"?theme.accent:reel.captionStyle === "pop"?"#e5ff3d":"#f4f4ef"):"#b0b0a8") : start + i === index ? theme.accent : theme.foreground,
              textDecoration: reel && start+i===index ? "underline" : undefined,
              textUnderlineOffset: 7,
              maxWidth: "100%",
              overflowWrap: "anywhere",
            }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
}
export const Film: React.FC<RenderProps> = ({
  project,
  words,
  narration,
  music,
  footage,
}) => {
  const f = useCurrentFrame(),
    { fps, durationInFrames, width, height } = useVideoConfig();
  let cursor = 0;
  const activeVoice = words.some((w) => f / fps >= w.start && f / fps < w.end);
  return (
    <AbsoluteFill
      style={{
        background: project.theme.background,
        color: project.theme.foreground,
        fontFamily: project.theme.font,
      }}
    >
      {project.theme.surface === "ambient" && !project.reel && <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 90% 15%, ${project.theme.accent}18, transparent 60%)`,
        }}
      />}
      {!project.reel && <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: 4,
          background: project.theme.accent,
          transformOrigin: "left",
          transform: `scaleX(${f / Math.max(1, durationInFrames - 1)})`,
        }}
      />}
      {footage ? (
        <AbsoluteFill
          style={{
            padding: project.footage?.layout === "full-frame" ? 0 : `${height * 0.07}px ${width * 0.03}px ${height * 0.22}px`,
            overflow: "hidden",
          }}
        >
          <OffthreadVideo
            src={staticFile(footage)}
            muted={Boolean(narration)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: project.footage?.crop ?? "contain",
              transform: `scale(${footageScaleAt(f/fps,project.footage?.punchIns??[])})`,
              transformOrigin: "50% 30%",
            }}
          />
        </AbsoluteFill>
      ) : (
        project.scenes.map((scene, i) => {
          const duration = Math.round(scene.duration * fps);
          const from = cursor;
          cursor += duration;
          return (
            <Sequence key={i} from={from} durationInFrames={duration}>
              {scene.kind==='world'?<WorldScene scene={scene} project={project}/>:scene.kind === "reel" ? (scene.motion?.style === "pop" ? <PopReelScene scene={scene} project={project}/> : <ReelScene scene={scene} project={project}/>) : <Panel scene={scene} theme={project.theme} />}
            </Sequence>
          );
        })
      )}
      <ProductionOverlays project={project}/>
      {narration && <Audio src={staticFile(narration)} />}
      {music && (
        <Audio
          src={staticFile(music)}
          loop
          volume={(project.music?.volume ?? 0.12) * (activeVoice ? 0.55 : 1)}
        />
      )}
      <Captions
        words={words}
        maxWords={project.captions?.maxWords ?? 5}
        theme={project.theme}
        reel={project.reel}
      />
      {project.theme.brand && !project.reel && (
        <div
          style={{
            position: "absolute",
            bottom: height * 0.055,
            left: width * 0.075,
            fontSize: width * 0.018,
            color: project.theme.muted,
            letterSpacing: 2,
          }}
        >
          {project.theme.brand}
          {project.theme.tagline && (
            <>
              {" "}
              <span style={{ color: project.theme.accent }}>●</span>{" "}
              {project.theme.tagline}
            </>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
const Root = () => (
  <Composition
    id="VideoForge"
    component={Film as any}
    durationInFrames={30}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={sample}
    calculateMetadata={({ props }: any) => ({
      durationInFrames: props.durationFrames,
      fps: props.project.fps,
    })}
  />
);
registerRoot(Root);
