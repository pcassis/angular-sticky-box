# Angular-sticky-box

Sticky-box is designed to make sidebar visible while scrolling. Both top and bottom edge is considered to position box.
It can also handle boxes higher than window. jQuery is NOT required.

[DEMO](http://embed.plnkr.co/gQMwNF0jVqxzMvxUN5Gx/)

### Installation

Install via bower

```shell
bower install angular-sticky-box
```

### Usage

Add it as a dependency to your app and then use angular-sticky-box in your HTML files.

```html
<div sticky-box>
	<div>
	<!-- sticky box content -->
	</div>
</div>
```

It's important that sticky-box element and related content element has equal height. It can be achieved with css flex-box.
See working example in /demo.

### Options

* `sticky-box-offset`: top offset in pixels. Useful when you have fixed header.

### Development

Install Gulp via npm if you don't have it
```shell
npm install -g gulp
```

### Available commands

* `gulp`: build and test the project
* `gulp build`: build the project and make new files in`dist`
* `gulp serve`: start a server to serve the demo page and launch a browser then watches for changes in `src` files to reload the page
* `gulp test`: run tests
* `gulp serve-test`: runs tests and keep test browser open for development. Watches for changes in source and test files to re-run the tests

### License
MIT
