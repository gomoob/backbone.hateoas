/*jshint -W030 */

describe(
    'Hal.Link', 
    function() {

        describe('initialize', function() {

            it('With missing required properties should fail', function() {

                expect(function() { new Hal.Link(); }).to.throw(Error, 'Missing required property "href" !');

            });
            
            it('With required properties should succeed', function() {
               
                var link = new Hal.Link(
                    {
                        href : 'http://www.google.com'
                    }
                );

                expect(link.get('href')).to.equal('http://www.google.com');
                expect(link.getHref()).to.equal('http://www.google.com');

            });

        });
        
    }
);