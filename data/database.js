/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class User {}
class Count {}

// Mock data
const viewer = new User()
viewer.id = '1'
viewer.name = 'Anonymous'
const counter = new Count()
counter.user_id = viewer.id
counter.count = 0

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: id => (id === viewer.id ? viewer : null),
  getViewer: () => viewer,
  getCount: id => (id === counter.user_id ? counter.count : null),
  incrementCount: id => (id === counter.user_id ? (counter.count += 1) : null),
  decrementCount: id => (id === counter.user_id ? (counter.count -= 1) : null),
  User,
  Count
}
