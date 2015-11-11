/**
 * Object which defines an Error Handler used in the library, this error handler is the default one used. Developers can
 * easily override this Error Handler to implement their own error handling code.
 *
 * In the library each time an error is encountered the `capture(message, context)` method is called, then by default
 * the library throws an `Hal.Error`.
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
Hal.ErrorHandler = {

    /**
     * Function used to capture a new error.
     *
     * @param message A message describing the error.
     * @param method The name of the method where the error was encountered.
     * @param context An object which transport additional informations about the error.
     *
     * @throws Hal.Error The encountered error.
     */
    capture : function(message, method, context)
    {
        var halError = new Hal.Error(message);
        halError.method = method;
        halError.context = context;
        throw halError;
    }
};
