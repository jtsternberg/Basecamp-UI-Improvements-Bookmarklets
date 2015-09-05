module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
    		files: ['Gruntfile.js', 'bookmarklets/**/*.js', '!bookmarklets/**/*.min.js', '!bookmarklets/**/*.bookmarklet.js'],
			options: {
				curly   : true,
				eqeqeq  : true,
				immed   : true,
				latedef : true,
				newcap  : true,
				noarg   : true,
				sub     : true,
				unused  : true,
				undef   : true,
				boss    : true,
				eqnull  : true,
				globals : {
					exports : true,
					module  : false
				},
				predef  :['document','window','alert','jQuery','setTimeout','prompt']
			}
		},

		concat : {
			dist: {
				files: { 'basecamp-ui-improvements.js': ['bookmarklets/**/*.js', '!bookmarklets/**/*.bookmarklet.js'] }
			}
		},

		uglify: {
			all: {
				files: {
					'basecamp-ui-improvements.min.js': ['basecamp-ui-improvements.js'],
				},
				options: {
					mangle: false
				}
			}
		},

		watch: {
			js: {
				files: ['Gruntfile.js', 'bookmarklets/**/*.js', '!bookmarklets/**/*.min.js', '!bookmarklets/**/*.bookmarklet.js'],
				tasks: ['default'],
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
