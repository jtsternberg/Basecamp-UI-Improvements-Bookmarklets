(function(window, document, $, undefined){
	'use strict';

	var app;

	if ( window.BC3HighlightMe && window.BC3HighlightMe.highlightMe ) {
		return window.BC3HighlightMe.init();
	}

	var getEl = function( id ) {
		return document.getElementById( id );
	};

	var $id = function( id ) {
		return $( getEl( id ) );
	};

	app = {
		me : $( '[name="current-person-id"]' ).attr( 'content' ),
		highlighted : null
	};

	app.unHighLight = function() {
		$id( 'bc-highlight-me' ).text( 'Highlight My Tasks' );
		$( '.BC-highlight-me' ).removeClass( 'BC-highlight-me' );
		app.highlighted = false;
	};

	app.doHighlight = function() {
		var $todos = app.getToDos();

		$id( 'bc-highlight-me' ).text( 'Unhighlight My Tasks' );

		if ( $todos.length ) {
			$todos.addClass( 'BC-highlight-me' );
		}

		app.triggerEvent( $todos );

		app.highlighted = true;

		return $todos;
	};

	app.highlightMe = function( clicked ) {
		if ( ! app.me || ( ! clicked && null === app.highlighted ) ) {
			return;
		}

		app.maybeAddButton();

		if ( app.highlighted && clicked ) {
			return app.unHighLight();
		}

		if ( ! app.highlighted && clicked ) {

			var $todos = app.doHighlight();

			if ( ! $todos.length ) {
				window.alert( 'Hey, looks like you\'re task-free!' );
			} else {
				window.alert( 'Found '+ $todos.length +' tasks for you.' );
			}
		}
	};

	app.init = function() {
		app.addStyles();
		app.maybeAddButton();
	};

	app.addStyles = function() {
		if ( ! getEl( 'bc-highlight-me-styles' ) ) {
			var css = '';
			css += '<style id="bc-highlight-me-styles" type="text/css" media="screen">';
				css += '.BC-highlight-me {';
					// css += 'background: #FFFF5C;';
					css += 'background: rgba(255, 255, 92, 0.4);';
					css += 'border-radius: 15px;';
					css += 'padding: 5px 8px 5px 10px !important;';
					css += 'margin-left: -10px !important;';
					css += 'margin-bottom: 7px;';
				css += '}';
				css += '#bc-highlight-me {';
					css += 'margin-right: 5px';
				css += '}';
			css += '</style>';
			$( 'head' ).append( css );
		}
	};

	app.maybeAddButton = function() {
		if ( ! getEl( 'bc-highlight-me' ) ) {
			var $toolbar = $( '.perma-toolbar' );
			var $btn = $toolbar.find( '[data-bridge-action-type="bookmark"]' );
			var classes = $btn.attr( 'class' ).replace( new RegExp( 'bookmark', 'g' ), 'highlight-me' );
			$btn.before( '<button id="bc-highlight-me" type="button" class="'+ classes +'"></button>');
			if ( ! app.highlighted ) {
				app.unHighLight();
			} else {
				app.doHighlight();
			}

			$( document.body ).on( 'click', '#bc-highlight-me', app.highlightMe );
		}
	};

	app.getToDos = function() {
		return $( '[data-avatar-for-person-id="'+ app.me +'"]' ).parents( 'li.todo' );
	};

	app.triggerEvent = function( $todos ) {
		if ( $todos.length ) {
			var ids = $todos.parents( '.todolist' ).map( function() { return $( this ).data( 'recordingId' ); } ).get();
			$( 'body' ).trigger( 'basecamp_tasks_highlighted', { 'type' : 'me', 'ids' : ids } );
		}
	};

	app.init();

	// Check for highlight every second. This accounts for page navigation.
	app.interval = app.interval || window.setInterval( app.init, 1500 );

	window.BC3HighlightMe = window.BC3HighlightMe || app;

})(window, document, jQuery);

(function(window, document, $, undefined){
	'use strict';

	if ( window.BCHighlightUser && window.BCHighlightUser.init ) {
		return window.BCHighlightUser.init();
	}

	var getEl = function( id ) {
		return document.getElementById( id );
	};

	var app = {
		search_name : ''
	};

	if ( ! $.expr[':'].Contains ) {
		$.expr[':'].Contains = function(a, i, m) {
			return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
		};
	}

	app.searchUser = function() {
		app.search_name = prompt( 'Search Name:' );

		var $search = app.highlightUser();

		var number = false !== $search && $search.length ? $search.length : 'No';
		alert( number + ' tasks found for '+ app.search_name + '.' );

		app.triggerEvent( $search );
	};

	app.init = function() {
		app.maybeAddStyles();
		app.maybeAddButton();
		app.highlightUser();
	};

	app.maybeAddStyles = function() {
		if ( ! getEl( 'bc-highlight-user-styles' ) ) {
			var css = '';
			css += '<style id="bc-highlight-user-styles" type="text/css" media="screen">';
				css += '.BC-user-highlight {';
				// css += 'background: #A4FF5C;';
				css += 'background: rgba(164, 255, 92, 0.42);';
					css += 'border-radius: 15px;';
					css += 'padding: 5px 8px 5px 10px !important;';
					css += 'margin-left: -10px !important;';
					css += 'margin-bottom: 7px;';
				css += '}';
			css += '</style>';
			$( 'head' ).append( css );
		}
	};

	app.maybeAddButton = function() {
		if ( ! getEl( 'bc-highlight-user' ) ) {
			var $toolbar = $( '.perma-toolbar' );
			var $btn = $toolbar.find( '[data-bridge-action-type="bookmark"]' );
			var classes = $btn.attr( 'class' ).replace( new RegExp( 'bookmark', 'g' ), 'highlight-user' );
			$btn.before( '<button id="bc-highlight-user" class="'+ classes +'" type="button">Search User <span class="topnav-menu__icon topnav-menu__icon--search"></span></button>');

			$( document.body ).on( 'click', '#bc-highlight-user', app.searchUser );
		}
	};

	app.highlightUser = function() {
		if ( ! app.search_name ) {
			return;
		}

		app.maybeAddButton();

		var $search = $( '.todo_assignee .todo_assignee_name:Contains('+ app.search_name +')' );

		if ( ! $search.length ) {
			return false;
		}

		$( '.BC-user-highlight' ).removeClass( 'BC-user-highlight' );

		return $search.parents( 'li.todo' ).addClass( 'BC-user-highlight' );
	};

	app.triggerEvent = function( $search ) {
		if ( $search.length ) {
			var ids = $search.parents( '.todolist' ).map( function() { return $( this ).data( 'recordingId' ); } ).get();
			$( 'body' ).trigger( 'basecamp_tasks_highlighted', { 'type' : 'me', 'ids' : ids } );
		}
	};

	app.init();

	// Check for highlight every second. This accounts for page navigation.
	app.interval = app.interval || window.setInterval( app.init, 1500 );

	window.BCHighlightUser = window.BCHighlightUser || app;

})(window, document, jQuery);

(function(window, document, $, undefined){
	'use strict';

	if ( window.BCMinifier && window.BCMinifier.init ) {
		window.BCMinifier.init();
		return;
	}

	var getEl = function( id ) {
		return document.getElementById( id );
	};

	var app = {
		upArrow : '&ShortUpArrow;',
		dwnArrow : '&ShortDownArrow;',
		autoHide : false
	};

	app.init = function() {
		app.maybeAddStyles();
		app.maybeAddButtons();

		if ( app.autoHide && 'done' !== app.autoHide ) {
			setTimeout( function() {
				$( '.minifier.minify-all' ).trigger( 'click' );
			}, 100 );
			app.autoHide = 'done';
		}
	};

	app.maybeAddStyles = function() {
		if ( ! getEl( 'bc-minifiy-lists-styles' ) ) {
			var css = '';
			css += '<style id="bc-minifiy-lists-styles" type="text/css" media="screen">';
				css += '.minifier.minify-lists, .minify-all-icon {';
					css += 'top: .05em;';
					css += 'cursor: pointer;';
					css += 'background: #3cb371;';
					css += 'padding: 1px 6px;';
					css += 'border-radius: 30px;';
					css += 'color: #ffffff;';
					css += 'font-size: 1.5em;';
					css += 'display: inline-block;';
					css += 'margin-left: 6px;';
					css += 'position: relative;';
					css += 'width: 1.2em;';
					css += 'height: 1.2em;';
					css += 'line-height: 1em;';
					css += 'text-align: center;';
				css += '}';
				css += '.minifier.minify-lists {';
					css += 'position: absolute;';
					css += 'right: 0;';
				css += '}';
				css += '.minifier.minify-all {';
					css += 'display: inline-block;';
					css += 'margin-left: 10px;';
					css += 'cursor: pointer;';
				css += '}';
			css += '</style>';
			$( 'head' ).append( css );
		}
	};

	app.maybeAddButtons = function() {
		if ( app.addAllButton() ) {
			$( '.many_lists .todolist' ).each( app.addButtons );

			$( document.body )
				.on( 'click', '.minifier.minify-all', app.toggleAllLists )
				.on( 'click', '.minifier.minify-lists', app.toggleList )
				.on( 'basecamp_tasks_highlighted', app.maybeShowOnHighlight );
		}
	};

	app.addAllButton = function() {
		if ( ! getEl( 'bc-minifiy-all-lists' ) ) {
			var $btn = $( '.action_button.primary[data-behavior="expand_new_todolist"]' );
			var html = '<div id="bc-minifiy-all-lists" class="minifier minify-all" title="Minify All"><span class="minify-all-text">Minify All</span><span class="minify-all-icon">' + app.upArrow +'</span></div>';

			$btn.after( html );

			return true;
		}

		return false;
	};

	app.addButtons = function() {
		var $this = $( this );
		var id = $this.attr( 'id' );

		if ( ! id || undefined === typeof id || $this.find( '.minifier' ).length > 0 ) {
			return;
		}

		var html = '<div class="minifier minify-lists" title="Minify List" data-selector="' + id + '">' + app.upArrow +'</div>';

		$this.css({ 'position':'relative' }).append( html );
	};

	app.toggleList = function( evt, state ) {
		var $button = evt instanceof jQuery ? evt : $( this );
		var $list = $( document.getElementById( $button.data( 'selector' ) ) );
		var $items = $list.find( 'ul.todos.remaining, ul.todos.completed' );

		function open() {
			$items.show();
			$button.data( 'hidden', false ).html( app.upArrow ).attr( 'title', 'Minify List' );
		}

		function close() {
			$items.hide();
			$button.data( 'hidden', true ).html( app.dwnArrow ).attr( 'title', 'Expand List' );
		}

		if ( 'close' === state ) {
			return close();
		}

		if ( $button.data( 'hidden' ) || 'open' === state ) {
			return open();
		}

		close();
	};

	app.toggleAllLists = function() {
		var $all_button = $( this );
		var closeIt = ! $all_button.data( 'hidden' );

		$( '.minifier.minify-lists' ).each( function() {
			app.toggleList( $( this ), closeIt ? 'close' : 'open' );
		});

		var html = closeIt ? app.dwnArrow : app.upArrow;
		var title = closeIt ? 'Expand All' : 'Minify All';

		$all_button.data( 'hidden', closeIt ).attr( 'title', title );
		$all_button.find( '.minify-all-text' ).html( title );
		$all_button.find( '.minify-all-icon' ).html( html );
	};

	app.maybeShowOnHighlight = function( evt, data ) {
		var index;
		for (index = data.ids.length - 1; index >= 0; index--) {
			var $button = $( '[data-selector="recording_' + data.ids[ index ] + '"]' );
			if ( $button.length && $button.data( 'hidden' ) ) {
				$button.trigger( 'click' );
			}
		}
	};

	app.init();

	// Check for highlight every second. This accounts for page navigation.
	app.interval = app.interval || window.setInterval( app.init, 1500 );

	window.BCMinifier = window.BCMinifier || app;

})(window, document, jQuery);
