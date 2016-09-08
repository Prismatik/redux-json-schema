import flow from 'rollup-plugin-flow';
import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/main.js',
  dest: 'lib/main.js',
  format: 'cjs',
  plugins: [flow(), buble()]
};