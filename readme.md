# polyline-clean [![experimental](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges) [![Build Status](https://travis-ci.org/dy/polyline-clean.png)](https://travis-ci.org/dy/polyline-clean)

Clean polyline or polygon data: remove duplicate, collinear, null points, etc.

[![npm install polyline-clean](https://nodei.co/npm/polyline-clean.png?mini=true)](https://npmjs.org/package/polyline-clean/)

```js
const c = require('polyline-clean')

// remove degenerate/collinear segments
c([[0,0], [null,null], [1,1], [1,1], [.5,.5], [1,1], [3,3]])
// [[0,0], [3,3]]

// ids as output
c([[0,0], [.5,.5], [1,1]], {ids: true})
// [0, 2]

// angle threshold
c([[0,0], [.5,.500001], [1,1], [1,0]], {threshold: 1e-2})
// [[0,0], [1,1], [1,0]]

// polygon optimizations
c([[0,0], [2,2], [1,1], [0,1], [0,0]], {polygon: true})
//[[0,0], [1,1], [0,1]]
```

## Related

* [parse-poly](https://github.com/dy/parse-poly) − parse any polygon/polyline format and return list of coordinates.
* [simplify-path](https://www.npmjs.com/package/simplify-path) − simplify polyline with tolerance.

## License

(c) 2018 Dmitry Yv. MIT License
