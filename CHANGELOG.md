3.1
- added showing of last exception to the request tab for HTTP 500 responses
- added authenticated user info to the session tab
- added support for opening files in editor in stack traces (thanks xiaohuilam)
- improved displaying exceptions in the log tab now show the class, code, correct stack trace and support chained exceptions
- fixed xdebug installation instructions link pointing nowhere
- fixed error handling in some cases where metadata can't be retrieved
- fixed pretty printing not rendering numeric value "0" correctly
- fixed subrequest processing missing urldecode
- fixed some minor styles issues
- fixed metadata requests having wrong Content-Type when running as standalone (thanks ssnepenthe)

3.0.1
- fixed Clockwork not working in incognito mode (thanks YummyTofu)
- fixed requests not showing up in some rare cases (thanks alextime)

3.0
- added performance metrics and renamed the timeline tab to performance tab
- added new timeline component UI
- added peak memory usage to the performance tab
- added support for filtering all tables (thanks Gennnji)
- added support for reordering all tables
- added support for user-data (custom tabs)
- added request method, url, controller, response status and the ability to copy the url to the request tab (thanks sisve)
- added query counts and time on top of the database tab (thanks fgilio)
- added distinct colors to errors and warning in the log tab (thanks Gennnji)
- added support for stack traces in the log, events, database and cache tabs (thanks sisve)
- added total number of queries to the cache tab
- added Xdebug profiler to the performance tab
- added support for authentication (thanks xiaohuilam)
- added support for subrequests
- added support for dark theme when running as a standalone app
- improved pretty printing - arrays are shown as Array with items count, supports new type metadata, fixed showing booleans, added distinct styles to booleans, nulls, resources and anonymous functions
- improved the requests list behaviour, reliability of metadata loading and error handling
- improved performance dropping jQuery and other minor improvements
- improved dark theme highlight color to be a bit more contrasting (thanks robclancy)
- fixed requests table header to compensate for scrollbar
- fixed standalone app opening in a broken state if the web app have no metadata yet (thanks spaceemotion)
- dropped support for resizing requests table columns
- polished bunch of styles

2.2
- learn more about privacy when using Clockwork extensions - https://underground.works/clockwork/docs/extension-privacy
- added support for displaying route middleware (thanks Vercoutere)
- fixed not being able to load metadata if the url contains hash
- updated to latest Angular 1.x

2.1
- added "preserve log" feature (works similar as in the Dev Tools network tab)
- improved requests list behavior, requests are now shown in loading state while we are loading metadata, error message is shown if metadata fails to load
- changed to use webRequest api for observing HTTP request in both Chrome and Firefox (fixes latest Chrome Beta/Canary)
- fixed requests with redirect responses not being shown in Firefox
- fixed no requests being shown in Firefox if multiple instances of Clockwork are open

2.0.3
- fixed some layout issues (fixes firefox scrolling issue) (thanks spaceemotion)

2.0.2
- added workaround for a bug in Firefox 57 (thanks miclf)
- fixed crash when using custom metadata request headers, preserve header letter case (thanks SerafimArts)
- fixed log tab not showing context of the messages

2.0.1
- fixed not being able to scroll using the mouse wheel (thanks KKSzymanowski)
- fixed update notifications showing if the server-side has higher version (thanks KKSzymanowski)

2.0
- added cache tab, including stats like reads, hits, misses, writes, deletes, time and full cache query log with pretty-printed values and caller file support
- added events tab for apps using event dispatching
- added dark theme
- added showing of last request when Clockwork is opened
- added ability to load older requests
- added ability to collapse the requests list
- added support for showing classes of pretty-printed objects
- added support for running as a standalone app
- added Firefox compatibility
- added Clockwork server-side update notifications
- changed UI tweaks, new tab bar, tweaked colors and whitespace
- changed headers, get and post data, cookies and session data are now sorted alphabetically by name
- changed refactored whole metadata handling code and a lot of the UI code
- changed styles are now in SCSS using node-sass for compilation
- changed handling of invalid metadata to be more robust
- changed X-Clockwork-Version header is now optional
- changed deprecated Chrome api usage
- updated angular, jquery and other 3rd party libraries, switched to the "slim" jquery version
- cleaned up styles and markup

1.6
- added support for model and caller file name and line number in database tab (thanks OmarMakled and fitztrev for the idea)
- added support for caller file name and line number in log tab (thanks crissi for the idea)
- added support for context in the log tab (thanks crissi for the idea)
- improved pretty jason component to lazy-render objects improving UI performance a ton when logging large objects like Eloquent collections
- fixed sorting of database, log, view and emails tables not working
- fixed minor style issues with requests list error/warning count overlay on dark background
- fixed HTML injection in the pretty-jason component
- updated angular, jquery and other 3rd party libraries
- cleaned up and refactored some internal parts

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
