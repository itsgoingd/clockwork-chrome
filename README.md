<p align="center">
	<img width="412px" src="https://underground.works/clockwork/images/github/title.png">
	<img src="https://underground.works/clockwork/images/github/clockwork-intro.png">
</p>


### What is Clockwork?

Clockwork is a browser extension, providing tools for debugging and profiling your PHP applications, including request data, application log, database queries, routes, visualisation of application runtime and more.

Clockwork uses a server-side component, that gathers all the data and easily integrates with any PHP project, including out-of-the-box support for major frameworks.

Read more and try it out on the [Clockwork website](https://underground.works/clockwork).

*This repository contains the Clockwork Chrome extension.*

### Privacy

Installation and some updates of the Clockwork extension require privacy permissions.

Since our browsers handle a lot of personal information, we feel it's important to explain what we can do with each permission and why do we need them.

##### Permission to "Access your browsing activity"

Clockwork uses the `webNavigation` API, used for notifications about browser navigation, eg. entering URLs to address bar, clicking links, etc.

Used for the *preserve log* feature. When *preserve log* is *off*, we use this API to know when to clear the requests list.

##### Permission to "Read and modify all your data on all websites you visit"

Clockwork uses the `webRequest` API, used for observing HTTP requests made by the browser, including submitted data, URLs, full response content, with ability to block or modify these requests.

Used for observing incoming HTTP requests for Clockwork-enabled applications and loading Clockwork metadata from headers.

We immediately disregard any requests to non Clockwork-enabled applications, we never modify or store requests.

The extension available in the Chrome Web Store or Firefox Addons is always the latest tagged commit in this repository with no modifications.

### Licence

Copyright (c) 2013 Miroslav Rigler

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
