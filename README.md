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

## API

The backbone.hateoas library extends classical Backbone Model and Collection classes to provided specific HATEOAS and 
HAL features.

### HAL Resource classes

The HAL standard defines a generic resource concept, but Backbone defines 2 kinds of "resources" (the models and the 
collections). 

So backbone.hateoas defines 2 kinds of resources : 
 * The `Hal.Resource` class defines a generic HAL resource and is very similar to the `Backbone.Model` class ;
 * The `Hal.Collection` class is a specialized HAL resource dedicated to manipulation of collection resources, this one 
   is a little opinionated (but its design is based on REST API best practices).

#### Hal.Resource

#### Hal.Collection

The backbone.hateoas `Hal.Collection` class is an opinionated class to manipulate HAL collection resources, what we call 
a HAL collection is a resource having the following structure : 

```json
{
    "page" : 1, 
    "page_count" : 6,
    "page_size" : 12,
    "total_items" : 65,
    "_links" : {
        "self" : {
            "href" : "http://myserver.com/api/users?page=3"
        },
        "first" : {
            "href" : "http://myserver.com/api/users?page=1"
        },
        "last" : {
            "href" : "http://myserver.com/api/users?page=133"
        },
        "previous" : {
            "href" : "http://myserver.com/api/users?page=2"
        },
        "next" : {
            "href" : "http://myserver.com/api/users?page=4"
        } 
    },
    "_embedded" : {
        "users" : [
            { ... },
            { ... },
            ...
        ]
    }
}
```

The constraints imposed to have a valid HAL Collection are the following : 
 * The HAL resource MUST HAVE a page property (or index)
 * The HAL resource MUST HAVE a number of pages (or page count) property
 * The HAL resource MUST HAVE a page size property
 * The HAL resource MUST HAVE a total number of results property
 * The HAL resource MUST HAVE ONLY ONE embedded array property representing the elements of the current collection's 
   page

So a `Hal.Collection` object automatically manages paginated collections, the name of the attributes `page`, 
`page_count`, `page_size` and `total_items` have been chosen to be compliant with 
[Apigility](https://apigility.org/documentation/api-primer/halprimer "Apigility").

```javascript
var UserCollection = Hal.Collection.extend({
    model : function(attrs, options) {
        if(attrs.type === 'STUDENT') {

            return new Student(attrs);

        } else if(attrs.type === 'TEACHER') {

            return new Teacher(attrs);

        }
    }, 
    rel : 'users', 
    url : 'http://myserver.com/api/users'
});
var users = new UserCollection();
users.getFirstPage();
users.getLastPage();
users.getPreviousPage();
users.getNextPage();
```

### Manage links

#### Hal.Link

#### Hal.LinkArray

#### Hal.Links

### Manage embedded resources

## Release History 

### 0.1.0-alpha2
 * Add `_links` parsing and management
 * Add `_embedded` parsing and management
 * Continue user documentation

### 0.1.0-alpha1
 * First alpha release.
