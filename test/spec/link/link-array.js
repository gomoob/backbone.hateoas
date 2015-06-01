/*jshint -W030 */

describe(
    'Hal.LinkArray', 
    function() {

        describe('initialize', function() {

            it('With no models must throw an error', function() {

                expect(function() { new Hal.LinkArray(); }).to.throw(
                    Error,
                    'A LinkArray MUST BE created with at least one link model !'
                );

            });
            
            it('With models', function() {
               
                var linkArray = new Hal.LinkArray(
                    [
                        {
                            href: 'http://myserver.com/api/users/2'
                        },
                        {
                            href: 'http://myserver.com/api/users/3'
                        }
                    ]
                );
                
                expect(linkArray.size()).to.equal(2);
                expect(linkArray.at(0)).to.be.defined;
                expect(linkArray.at(0).getHref()).to.equal('http://myserver.com/api/users/2');
                expect(linkArray.at(1)).to.be.defined;
                expect(linkArray.at(1).getHref()).to.equal('http://myserver.com/api/users/3');

            });
            
        });
        
        describe('toJSON', function() {
           
            it('With models', function() {
                
                var linkArray = new Hal.LinkArray(
                    [
                        {
                            href: 'http://myserver.com/api/users/2'
                        },
                        {
                            href: 'http://myserver.com/api/users/3'
                        }
                    ]
                );
                
                expect(JSON.stringify(linkArray.toJSON())).to.equal(
                    JSON.stringify(
                        [
                            {
                                href: 'http://myserver.com/api/users/2'
                            },
                            {
                                href: 'http://myserver.com/api/users/3'
                            }
                        ]
                    )
                );

            });
            
        });
    }
);