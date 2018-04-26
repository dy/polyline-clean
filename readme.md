# polyline-clean [![experimental](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges) [![Build Status](https://travis-ci.org/dy/polyline-clean.png)](https://travis-ci.org/dy/polyline-clean)

Clean polyline or polygon data: remove duplicate, collinear, null points, etc.

[![npm install polyline-clean](https://nodei.co/npm/polyline-clean.png?mini=true)](https://npmjs.org/package/polyline-clean/)

```js
const c = require('polyline-clean')

// remove duplicate, degenerate or collinear segments
c([[0,0], [null,null], [1,1], [1,1], [.5,.5], [1,1], [3,3]])
// === [[0,0], [3,3]]
```

## `c(coordinates, options?)`

Return new coordinates array with bad points removed. If result is degenerate, `null` will be returned.

Option | Meaning
---|---
`ids` | Return indexes in the initial array instead of points.
`fold` | Collapse collinear segments. Can be a number indicating min angle threshold. `polygon` mode has more rigid folding. Useful to disable it when data has logarithmic fashion.
`polygon` | Apply polygon optimizations: remove coinciding end, collinear end segments, ignore degenerate results.

## Related

* [parse-poly](https://github.com/dy/parse-poly) − parse any polygon/polyline format and return list of coordinates.
* [simplify-path](https://www.npmjs.com/package/simplify-path) − simplify polyline with tolerance.

## License

(c) 2018 Dmitry Yv. MIT License
