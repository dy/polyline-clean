'use strict'

module.exports = function polyClean (coords, opts) {
  if (!opts) opts = {}

  var polygon = !!opts.polygon

  // ignore degenerate polygon
  if (polygon && coords.length < 3) return null

  // process collinearities
  var fold = opts.fold == null || opts.fold === true ? 0.000027 : opts.fold

  var result = [], ptr = 0

  while (ptr < coords.length) {
    var newPt = coords[ptr]

    if (bad(newPt)) {
      ptr++
      continue
    }

    var currPt = coords[result[result.length - 1]]
    var prevPt = coords[result[result.length - 2]]

    if (result.length && same(newPt, currPt)) {
      ptr++
      continue
    }

    // in the process result can collapse, hence check length
    if (result.length < 2) {
      result.push(ptr++)
      continue
    }

    var currDir = dif(newPt, currPt)
    var prevDir = dif(currPt, prevPt)

    var collinearSign = fold ? collinear(currDir, prevDir, fold) : 0

    // non-collinear or ignored folding
    if (!collinearSign) {
      result.push(ptr++)
      continue
    }

    // polygon ignores collinear/reverse lines
    if (polygon || collinearSign > 0) {
      result.pop()
      if (!same(newPt, prevPt)) result.push(ptr)
      ptr++
      continue
    }

    // polyline keeps collinear edge points and skips everything in between
    if (collinearSign < 0 && result.length > 2) {
      var prePrevPt = coords[result[result.length - 3]]
      var prePrevDir = dif(prevPt, prePrevPt)
      var prevCollinearSign = collinear(currDir, prePrevDir, fold)

      // if curr vector is collinear with the one before
      if (prevCollinearSign > 0) {
        var prePrevMag = mag(prePrevDir)
        var prevMag = mag(prevDir)
        var currMag = mag(currDir)

        // /\
        //   \  /  ~ skip
        //    \/
        if (currMag < prevMag && prePrevMag < currMag) {}
        //  /\
        // /  \    ~ skip
        //     \/
        else if (currMag < prePrevMag && prePrevMag < prevMag) {}
        //      /      /
        //     /   →
        //  /\/
        // /
        else if (currMag >= prePrevMag && prevMag <= prePrevMag) {
          result.pop()
          result.pop()
        }
        //      /     /
        //   /\/  →
        //  /
        // /
        else if (currMag >= prevMag && currMag <= prePrevMag) {
          result.pop()
          result.pop()
        }
        //      /        /
        // /\  /   →    /
        //   \/       \/
        else if (currMag >= prevMag && prevMag >= prePrevMag) {
          var p = result.pop()
          result.pop()
          result.push(p)
        }
        //   /\         /\
        //  /  \/  →   /
        // /          /
        else if (currMag <= prevMag && prevMag <= prePrevMag) {
          result.pop()
        }
      }
    }

    result.push(ptr++)
  }

  if (polygon) {
    // ignore degenerate resulting polygon
    if (result.length < 3) return null


    // remove coinciding end
    if (same(coords[result[0]], coords[result[result.length - 1]])) result.pop()

    // remove collinear last and first in case of polygons
    var firstPt = coords[result[0]]
    var secondPt = coords[result[1]]
    var lastPt = coords[result[result.length - 1]]
    var endCollinearSign = collinear(dif(secondPt, firstPt), dif(firstPt, lastPt), fold)
    if (endCollinearSign > 0) {
      result.shift()
      firstPt = secondPt
    }
    else if (endCollinearSign < 0) {
      result.pop()
    }

    // remove coinciding end once again
    if (same(firstPt, coords[result[result.length - 1]])) result.pop()

    // ignore degenerate resulting polygon
    if (result.length < 3) return null
  }

  // map ids if necessary
  if (!opts.index && !opts.ids) {
    for (ptr = 0; ptr < result.length; ptr++) {
      result[ptr] = coords[result[ptr]]
    }
  }

  return result
}

function bad(p) {
  if (!p || isNaN(p[0]) || isNaN(p[1]) || p[0] == null || p[1] == null) return true

  return false
}

function same(a, b) {
  return a[0] === b[0] && a[1] === b[1]
}

function dot(v1, v2) {
    return (v1[0] * v2[0]) + (v1[1] * v2[1])
}

function mag(a) {
  return Math.sqrt(a[0]*a[0] + a[1]*a[1])
}

function dif(a, b) {
  return [a[0] - b[0], a[1] - b[1]]
}

function collinear(a, b, minAngle) {
  var dotProduct = dot(a, b)

  var magA = mag(a)
  var magB = mag(b)

  var angle = Math.acos(dotProduct / (magA*magB))

  // unidirectional
  if (angle <= minAngle) return 1

  // reverse direction
  if (Math.abs(Math.PI - angle) < minAngle) return -1

  return 0
}
