module.exports = function(grunt) {

    /**
     * An object which defines the Grunt Project configuration.
     */
    var gruntConfiguration = {

        /**
         * Reads the 'package.json' file and puts its content into a 'pkg' Javascript object.
         */
        pkg : grunt.file.readJSON('package.json'),

        /**
         * Clean task.
         */
        clean : ['tmp/**/*'],

        /**
         * Instrument Task.
         */
        instrument : {
            files : [
                'src/**/*.js'
            ],
            options : {
                lazy : true,
                basePath : 'reports/coverage'
            }
        },

        /**
         * JSDoc Task.
         */
        jsdoc : {
            dist : {
                src: [
                    'jsdoc/README.md',
                    'src/**/*.js'
                ],
                options: {
                    configure : 'jsdoc/jsdoc.conf.json',
                    destination: 'tmp/jsdoc',
                    template : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'/*,
                    tutorials : 'tmp/replaced/jsdoc/tutorials'*/
                }
            }
        },

        /**
         * JSHint Task.
         */
        jshint : {
            src : {
                src : [
                    'Gruntfile.js',
                    'src/**/*.js'
                ]
            },
            test : {
                src : [
                    'test/**/*.js'
                ]
            }
        },

        /**
         * Make Report Task.
         */
        makeReport: {
            src: 'reports/coverage/**/*.json',
            options: {
                type: ['clover', 'cobertura', 'html', 'lcov'],
                dir: 'reports/coverage',
                print: 'detail'
            }
        },

        /**
         * Mocha Test Task.
         */
        mochaTest : {
            spec : {
                options : {
                    require : 'test/setup/node.js',
                    reporter : 'dot',
                    clearRequireCache : true,
                    mocha : require('mocha')
                },
                src : [
                    'test/spec/**/*.js'
                ]
            }
        },

        /**
         * Plato code analysis Task.
         */
        plato : {
            src : {
                files : {
                    'reports/plato' : ['src/**/*.js']
                }
            }
        },

        /**
         * Configures task used to pre process files
         */
        preprocess : {
            lib : {
                src : 'src/umd-wrapper.js',
                dest : 'dist/backbone.hateoas.js'
            }
        },

        /**
         * Store coverage Task.
         */
        storeCoverage: {
            options: {
                dir: 'reports/coverage'
            }
        },

        /**
         * Task used to minify the library.
         */
        uglify: {
            lib: {
                src: 'dist/backbone.hateoas.js',
                dest: 'dist/backbone.hateoas.min.js',
                options: {
                    sourceMap: true
                }
            }
        },

        /**
         * Watch Task.
         */
        watch: {
            tests: {
                options: {
                    spawn: false
                },
                files: ['src/**/*.js', 'test/spec/**/*.js'],
                tasks: ['test']
            }
        }

    };  /* Grunt project configuration object */

    // This has to be done before calling 'initConfig' (see https://github.com/sindresorhus/time-grunt)
    require('time-grunt')(grunt);

    // Initialize the Grunt Configuration
    grunt.initConfig(gruntConfiguration);

    // Load the Grunt Plugins
    require('load-grunt-tasks')(grunt);

    /**
     * Task used to execute the unit tests of the project.
     */
    grunt.registerTask(
        'test',
        'Test the library',
        function() {

            process.env.srcDir = require('path').resolve(__dirname, 'src');

            grunt.task.run(
                [
                    'jshint:src',
                    'jshint:test',
                    'preprocess',
                    'mochaTest'
                ]
            );

        }
    );

    /**
     * Task used to generate a coverage report.
     */
    grunt.registerTask(
        'coverage',
        'Generate coverage report for the library',
        function() {

            // For coverage our source directory is 'reports/coverage/src'
            process.env.srcDir = require('path').resolve(__dirname, 'reports/coverage/src');

            grunt.task.run(
                [
                    'jshint:src',
                    'jshint:test',
                    'instrument',
                    'mochaTest',
                    'storeCoverage',
                    'makeReport'
                ]
            );

        }
    );

    /**
     * Task used to build the library.
     */
    grunt.registerTask(
        'build',
        'Build the library',
        [
            'test',
            'uglify'
        ]
    );

    /**
     * Default task.
     */
    grunt.registerTask(
        'default',
        [
            'clean',
            'build'
        ]
    );

};
