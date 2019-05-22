module.exports = function(grunt)
{

  grunt.initConfig({

    nodemon: {
      dev: {
        script: 'index.js'
      }
    }
    });

  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['nodemon']);

  grunt.registerTask('mongo', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

};
