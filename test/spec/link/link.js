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

                expect(link.get('deprecation')).to.be.undefined;
                expect(link.getDeprecation()).to.be.undefined;
                expect(link.get('name')).to.be.undefined;
                expect(link.getName()).to.be.undefined;
                expect(link.get('href')).to.equal('http://www.google.com');
                expect(link.getHref()).to.equal('http://www.google.com');
                expect(link.get('hreflang')).to.be.undefined;
                expect(link.getHreflang()).to.be.undefined;
                expect(link.get('profile')).to.be.undefined;
                expect(link.getProfile()).to.be.undefined;
                expect(link.get('title')).to.be.undefined;
                expect(link.getTitle()).to.be.undefined;
                expect(link.get('type')).to.be.undefined;
                expect(link.getType()).to.be.undefined;
                expect(link.get('templated')).to.be.false;
                expect(link.isTemplated()).to.be.false;
                
            });

        });
        
        describe('toJSON', function() {

            it('With very simple link', function() {
                
                var link = new Hal.Link(
                    {
                        href : 'http://www.google.com'
                    }
                );
                
                expect(JSON.stringify(link.toJSON())).to.equal(JSON.stringify({href: 'http://www.google.com'}));

            });
            
            it('With all possible properties', function() {
               
                var link = new Hal.Link(
                    {
                        deprecation : 'http://myserver.com/deprecation',
                        name : 'LINK_NAME',
                        href : 'http://myserver.com/users/{id}',
                        hreflang : 'fr',
                        profile : 'http://myserver.com/profile',
                        templated : true,
                        title : 'LINK_TITLE',
                        type : 'application/hal+json'
                    }
                );

                expect(JSON.stringify(link.toJSON())).to.equal(JSON.stringify({
                    deprecation : 'http://myserver.com/deprecation',
                    name : 'LINK_NAME',
                    href : 'http://myserver.com/users/{id}',
                    hreflang : 'fr',
                    profile : 'http://myserver.com/profile',
                    templated : true,
                    title : 'LINK_TITLE',
                    type : 'application/hal+json'
                }));
                
            });
            
        });
        
    }
);