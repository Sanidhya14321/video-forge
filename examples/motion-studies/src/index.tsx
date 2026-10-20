import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Film} from './Film';
const Root=()=> <Composition id="Film" component={Film} width={1080} height={1920} fps={60} durationInFrames={900}/>;
registerRoot(Root);
