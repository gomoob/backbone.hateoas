# backbone.hateoas

> A library to use HAL and HATEOAS in your Backbone and Marionette applications.

**backbone.hateoas** is a Javascript library which facilitate the use of the HAL (*Hypermedia Application Language) 
standard in your application.

The HAL specification is quicly described here http://stateless.co/hal_specification.html, the JSON version of HAL has 
also been published as an internet draft here : https://tools.ietf.org/html/draft-kelly-json-hal-06.

## Install

The easiest way to use the library is to pull it with [Bower](http://bower.io/ "Bower") by adding the following 
dependency inside your `bower.json file`.

```json
{
    "devDependencies": {
        "backbone.hateoas" : "~0.1",
    }
}
```

## Usage

### Require JS

```javascript
define('backbone.hateoas', function(Hal) {

    var user = new Hal.Model({
        urlRoot : 'https://myserver/rest/users/1'    
    });

});
```

# Release History 

## 0.1.0-alpha1
 * First alpha release.
