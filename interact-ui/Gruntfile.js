module.exports = function(grunt) {

  // Testing modules dependencies
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-px-to-rem');

  grunt.registerTask('default', ['tests', 'prepareOutput', 'copy:dev', 'styles:dev']);
  grunt.registerTask('dev', ['tests', 'prepareOutput', 'copy:dev', 'styles:dev', 'watch']);
  grunt.registerTask('deploy', ['tests', 'prepareOutput', 'copy:dev', 'styles:deploy']);

  // Tests taks
  grunt.registerTask('tests', ['jshint']);

  // Styles tasks
  grunt.registerTask('styles:dev', ['clean:styles', 'compass:dev', 'px_to_rem:dev', 'clean:main']);
  grunt.registerTask('styles:deploy', ['clean:styles', 'compass:deploy', 'px_to_rem:deploy', 'clean:main']);
  grunt.registerTask('prepareOutput', ['clean:styles', 'clean:assets', 'clean:javascript']);

  // Javascript tasks
  grunt.registerTask('javascript:dev', ['copy:js']);

  // Copy task
  grunt.registerTask('copy:dev', ['copy:assets', 'copy:js']);

  grunt.initConfig({

    // Source paths
    rootPath: '.',
    srcPath: '<%=rootPath%>/src',
    imgPath: '<%=srcPath%>/images',
    sassPath: '<%=srcPath%>/sass',

    // JS files path
    jsPath: '<%=srcPath%>/js',
    vendorJsPath: '<%=srcPath%>/vendor',

    // Deployment path
    devDeployPath: '<%=rootPath%>/output',
    devDeployImgPath: '<%=devDeployPath%>/images',
    devDeployCssPath: '<%=devDeployPath%>/css',
    devDeployJsPath: '<%=devDeployPath%>/js',
    devDeployVendorPath: '<%=devDeployPath%>/js/vendor',
    devDeployOutputCssPath: '<%=devDeployCssPath%>/main.css',

    jshint: {
      files: ['<%=jsPath%>'],
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        forin: true,

        globals: {
          document: true,
          window: true,
          console: true,
          require: true,
          define: true,
          latedef: true,
          noarg: true,
          noempty: true,
          nonew: true,
          quotmark: 'single',
          undef: true,
          unused: true,

          // Environments
          browser: true,
          jquery: true
        }
      }
    },

    // Deletes generated files for a clean start.
    clean: {
      options: {
        force: true
      },
      styles: [
        '<%=devDeployCssPath%>'
      ],
      main: [
        '<%=devDeployOutputCssPath%>*'
      ],
      assets: [
        '<%=devDeployImgPath%>'
      ],
      javascript: [
        '<%=devDeployJsPath%>',
        '<%=devDeployVendorPath%>'
      ]
    },

    // Copy static files to destination folders.
    copy: {
      assets: {
        files: [
          { expand: true, cwd: '<%=imgPath%>/', src: ['**'], dest: '<%=devDeployImgPath%>/' }
        ]
      },
      js: {
        files: [
          { expand: true, cwd: '<%=jsPath%>/', src: ['**'], dest: '<%=devDeployJsPath%>/' },
          { expand: true, cwd: '<%=vendorJsPath%>/', src: ['**'], dest: '<%=devDeployVendorPath%>/' }
        ]
      }
    },

    // Compiles SCSS and SASS code into CSS. Generates sprites magically.
    compass: {
      options: {
        require: 'susy',
        httpPath: '/'
      },

      // Creates CSS with no compression for Dev
      dev: {
        options: {
          sourcemap: true,
          outputStyle: 'nested',
          sassDir: '<%=sassPath%>',
          cssDir: '<%=devDeployCssPath%>'
        }
      },
      deploy: {
        options: {
          sourcemap: false,
          outputStyle: 'compressed',
          sassDir: '<%=sassPath%>',
          cssDir: '<%=devDeployCssPath%>'
        }
      }
    },

    // Watchers
    watch: {
      scss: {
        files: ["<%=srcPath%>/**/*.scss"],
        tasks: ["styles:dev"]
      },
      js: {
        files: "<%=srcPath%>/**/*.js",
        tasks: ["clean:javascript", "jshint", "javascript:dev"]
      }
    },

    // PX to REM
    px_to_rem: {
      options: {
        base: 16,
        fallback_existing_rem: false,
        ignore: []
      },
      dev: {
        options: {
          fallback: true,
          map: true
        },
        files: {
          '<%=devDeployCssPath%>/scion-theme.css': ['<%=devDeployOutputCssPath%>']
        }
      },
      deploy: {
        options: {
          fallback: false,
          map: false
        },
        files: {
          '<%=devDeployCssPath%>/scion-theme.css': ['<%=devDeployOutputCssPath%>']
        }
      }
    }

  });
};
