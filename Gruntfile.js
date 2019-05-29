module.exports = function(grunt) {

    grunt.registerTask('default', '', () => {
        // Do grunt-related things in here
        let servername = grunt.option('server');
        grunt.log.write(`Servername is ${servername}`);
        let servers = grunt.file.readJSON('config.json');

        if (servers && servers[servername]) {
            let server = servers[servername];
            grunt.log.write(`deploying to ${server.path}`);

            grunt.file.copy('src/', server.path);
        }
    });

};