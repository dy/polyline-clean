'use strict'

const c = require('./')
const t = require('tape')

t('remove degenerate segments', t => {
	t.deepEqual(
		c([[0,0], [null,null], [1,1], [1,1], [.5,.5], [1,1], [3,3]]),
		[[0,0], [3,3]]
	)
	t.end()
})

t('multiple repeats', t => {
	t.deepEqual(
		c([[0,0], [1,1], [0,0], [1,1], [.1,.1], [2,2], [-.5,-.5], [1,1]]),
		[[0,0], [2,2], [-.5,-.5], [1,1]]
	)
	t.end()
})

t('ids as output', t => {
	t.deepEqual(
		c([[0,0], [.5,.5], [1,1]], {ids: true}),
		[0, 2]
	)
	t.end()
})

t('angle threshold', t => {
	t.deepEqual(
		c([[0,0], [.5,.500001], [1,1], [1,0]], {threshold: 1e-2}),
		[[0,0], [1,1], [1,0]]
	)
	t.end()
})

t('bad numbers', t => {
	t.deepEqual(c([null, [null], NaN, [0, 1], [null, null], null]), [[0,1]])
	t.end()
})

t('closed poly', t => {
	t.deepEqual(c([[0,0], [2,2], [1,1], [0,1], [0,0]], {polygon: true}), [[0,0], [1,1], [0,1]])
	t.end()
})


t('polygons', t => {
	t.deepEqual(c([null], {polygon: true}), null)
	t.deepEqual(c([[0,0]], {polygon: true}), null)
	t.deepEqual(c([null, [null], NaN, [0, 1], [null, null], null], {polygon: true}), null)

	t.deepEqual(c([[0,0], [.5,.500001], [1,1]], {threshold: 1e-2, polygon: true}) , null)

	t.deepEqual(c([[0,0], [.25,.5], [.5,.5], [.75,.75], [1,1]], {ids: true}) , [0,1,2,4])

	t.deepEqual(
		c([[0,0], [null,null],, [1,1], [0,2], [0,3], [0,4], [0,2], [1,1], [NaN,NaN], [.5,.5], [3,3], [0,3]], {polygon: true}),
		[[0,0], [3,3], [0,3]]
	)


	t.deepEqual(
		c([[0,0], [null,null],, [1,1], [0,2], [0,3], [0,4], [0,2], [2,0], [1,1], [NaN,NaN], [.5,.5], [3,3], [0,3]], {polygon: true}),
		[[0,0], [3,3], [0,3]]
	)
	t.end()
})

t('normal points', t=>{
	t.deepEqual(c([[0,0], [1,1], [2,3]], {polygon: true}), [[0,0], [1,1], [2,3]])
	t.end()
})

t('closed shape', t=>{
	t.deepEqual(c([[0,0], [1,1], [0,1], [0,0]], {polygon: true}), [[0,0], [1,1], [0,1]])
	t.end()
})

t('degenerate', t=>{
	t.deepEqual(c([[0,0]], {polygon: true}), null)
	t.deepEqual(c([[0,0], [1,1]], {polygon: true}), null)
	t.deepEqual(c([[0,0], [1,1], [2,0], [1,1]], {polygon: true}), null)
	t.deepEqual(c([[0,0], [1,1], [2,0], [1,1], [0,0]], {polygon: true}), null)
	t.deepEqual(c([[0,0], [1,1], [2,0], [3,0], [2,0], [1,1], [2,2]], {polygon: true}), null)
	t.end()
})
