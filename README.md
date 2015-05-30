# backbone.hateoas

> A library to use HAL and HATEOAS in your Backbone and Marionette applications.

**backbone.hateoas** is a Javascript library which facilitate the use of the HAL (*Hypermedia Application Language*) 
standard in your application.

The HAL specification is quickly described here http://stateless.co/hal_specification.html, the JSON version of HAL has 
also been published as an internet draft here : https://tools.ietf.org/html/draft-kelly-json-hal-06.

## Install

The easiest way to use the library is to pull it with [Bower](http://bower.io/ "Bower") by adding the following 
dependency inside your `bower.json` file.

```json
{
    "devDependencies": {
        "backbone.hateoas" : "~0.1",
    }
}
```

## Usage

backbone.hateoas has been created to work with Backbone but you can also use it in any environment. We present here how 
to use the library in your project.

### Classical

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Sample backbone.hateoas usage</title>
    </head>
    <body>
        Hello <span id="name"></span> !
    </body>
    
    <!-- Required dependencies -->
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="underscore.js"></script>
    <script type="text/javascript" src="backbone.js"></script>
    <script type="text/javascript" src="backbone.paginator.js"></script>
    <script type="text/javascript" src="backbone.hateoas.js"></script>
    
    <!-- Sample usage -->
    <script type="text/javascript">

        var user = new Hal.Model();
        user.urlRoot = 'http://myrestserver/users/1'; 
        user.fetch().done(function() {
            $('#name').text(user.get('firstName') + ' ' + user.get('lastName'));
        });

    </script>
</html>
```

### Browserify

### Node JS

### Require JS

```javascript
define('backbone.hateoas', function(Hal) {

    var user = new Hal.Model({
        urlRoot : 'https://myserver/rest/users/1'    
    });

    console.log('Hello '+ user.get('firstName') + ' ' + user.get('lastName') + ' !');

});
```



## Release History 

### 0.1.0-alpha2
 * 

### 0.1.0-alpha1
 * First alpha release.
