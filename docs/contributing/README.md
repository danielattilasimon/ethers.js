-----

Documentation: [html](https://docs-beta.ethers.io/)

-----

Contributing and Hacking
========================


The ethers.js library is something that I've written out of necessity,
and has grown somewhat organically over time.

Many things are the way they are for good (at the time, at least) reasons,
but I always welcome criticism, and am completely willing to have my mind
changed on things.

So, pull requests are always welcome, but please keep a few points in mind:



* Backwards-compatibility-breaking changes will not be accepted; they may be considered for the next major version
* Security is important; adding dependencies require fairly convincing arguments as to why
* The library aims to be lean, so keep an eye on the dist/ethers.min.js file size before and after your changes
* Add test cases for both expected and unexpected input
* Any new features need to be supported by me (future issues, documentation, testing, migration), so anything that is overly complicated or specific may not be accepted

In general, **please start an issue *before* beginning a pull request**, so we can
have a public discussion and figure out the best way to address to problem/feature.
**:)**


Building
--------


use npm run auto-build

use npm run update-version



-----
**Content Hash:** 3afa848a6ccb408a68688beca905d8156e85277534f8cace5b7dd08991c30347