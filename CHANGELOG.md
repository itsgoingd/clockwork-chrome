2.0
- add a new protocol version allow all application to log what ever they need
  - the request tabs is dynamic. ex : "request": {"Title" : {}, "Title2" : {}}, you can log here post, get, ... but also for example user logged, shopping bag, ...
  - all the data coming from "data": {"Title" : {"Subtitle" : {}}} will create a tab for Title and create a dynamic section on this tabs with a tab describing this section. For example, you can add a Database Connection section with all connection duration to a database and a Database Query with all the query)
  - the timeline can have many line per section (all the database queries for example)
  - the timeline can be field with user data (sql queries, ...), you only need to have a "start" & "duration" on the data
- add a backward compatibily function, in order to keep older protocol version working
- added a gulp serve in order to accelerate development process
- remove jquery tabs to implement a angular based tabs
- upgrade to angular 1.4.8

1.5
- added support for resizing requests table columns
- added tooltips to requests table showing cell values
- added errors and warnings counts to the requests table
- changed incoming requests behavior, incoming requests are no longer automatically shown when other then last request was manually selected, selecting last request or clearing requests resets the default behaviour
- changed toolbar implementation to a custom one to save some vertical space
- changed timeline and log tabs to not be shown when there are no records to show
- fixed requests table not scrolling to new requests properly

1.4.3
- fixed compatibility with web server sending lowercase headers (thanks EvanDarwin)

1.4.2
- added connection column to database tab when there are queries from multiple connections in request data

1.4.1
- fixed a bug where numeric values were displayed as empty objects

1.4
- added views and emails tabs
- empty tabs are no longer shown
- improved compatibility when incomplete data is received

1.3.1
- log level is now specified as string by client, allowing any level names
- added support for custom headers on metadata requests specified by client via X-Clockwork-Header-NAME headers
- fixed non-string and object values not being pretty-printed correctly

1.2
- updated design for the new flatter dev tools look comming in Chrome 32
- json values in request data, logs, session and cookies now displayed as interactive elements similar to Chrome javascript console
- fixed compatibility with some older versions of the Clockwork php library
- fixed wrong order of the timeline events

1.1
- added support for custom Clockwork data uri (used for apps running in subdirs for example)

1.0
- released on Chrome Web Store! - https://chrome.google.com/webstore/detail/clockwork/dmggabnehkmmfmdffgajcflpdjlnoemp
- added new standalone web app version - https://github.com/itsgoingd/clockwork-web
- changed extension logo

0.9.1
- added application routes tab
