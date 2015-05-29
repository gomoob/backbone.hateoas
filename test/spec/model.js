/*jshint -W030 */

describe(
    'Hal.Model', 
    function() {

        describe('initialize', function() {

            it('With no parameters should succeed', function() {

                var model = new Hal.Model();

                // Check links
                expect(model.get('_links')).to.be.undefined;
                expect(model.getLinks()).to.be.undefined;
                
                // Check embedded properties
                expect(model.get('_embedded')).to.be.undefined;

            });

        });

    }
);