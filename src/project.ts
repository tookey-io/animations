import {makeProject} from '@motion-canvas/core';

import noCode from './scenes/no-code@mix?scene';
import WebCodecPlugin from './exporter';
import dataFlows from './scenes/data-flows@mix?scene';
import web3 from './scenes/web3@mix?scene';

export default makeProject({
  scenes: [web3],
  plugins: [
    WebCodecPlugin(),
  ],
});
