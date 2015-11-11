/**
 * Object which defines an Error encountered in the library.
 *
 * This class extends the standard Javascript `Error` class by adding several useful informations :
 *  * The name of the method where the error was encountered ;
 *  * A context object which can transport several useful informations about the error.
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
Hal.Error = function(message) {
    this.name = 'HalError';
    this.message = message;
    this.stack = (new Error()).stack;

    // This is what Hal.Error adds to the standard Javascript Error class
    this.context = null;
    this.method = null;
};
Hal.Error.prototype = new Error();
