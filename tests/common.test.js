import test from 'node:test';import assert from 'node:assert/strict';import {dates} from '../api/_common.js';
test('date ranges',()=>{assert.equal(dates('2026-10-05','2026-10-11'),true);assert.equal(dates('2026-10-11','2026-10-05'),false);assert.equal(dates('notdate','2026-10-05'),false);});
