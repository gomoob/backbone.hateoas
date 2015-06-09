# backbone.hateoas

> A library to use HAL and HATEOAS in your Backbone and Marionette applications.

**backbone.hateoas** is a Javascript library which facilitates the use of the HAL (*Hypermedia Application Language*) 
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

### Global configuration

#### `contentType` property

The HAL standard defines 2 new media types which are `application/hal+json` and `application/hal+xml`, it also indicates 
the following : 

> When serving HAL over HTTP, the `Content-Type` of the response should contain the relevant media type name.

So it defines how the server should respond but is does not define how we should send HTTP POST, PUT and PATCH requests.
In fact this is something which seems to be left unspecified deliberatly. 

The `Hal.contentType` allow to configure how your models and collections should be serialized before being sent to the 
server (i.e is allow to change the behavior of the Backbone `toJSON()` method).

The current version of the library supports 2 content types : `application/json` and `application/hal+json`. 

##### application/json

The following sample...

```javascript
Hal.contentType = 'application/json';

var john = new Hal.Model();
john.urlMiddle = 'users';
john.set('id', 'jdoe');
john.fetch({
    success : function() {
        console.log(user.toJSON());     
    }
});
```

will display...

```
{
    "id": 1,
    "firstName": "John",
    "lastName" : "Doe",
    "address" : {
        "city" : "Paris",
        "country" : "France",
        "street" : "142 Rue de Rivoli",
        "zip" : "75001"
    }
}
```

##### application/hal+json

The following sample...

```javascript
Hal.contentType = 'application/hal+json';

var john = new Hal.Model();
john.urlMiddle = 'users';
john.set('id', 'jdoe');
john.fetch({
    success : function() {
        console.log(user.toJSON());     
    }
});
```

will display...

```
{
    "id": 1,
    "firstName": "John",
    "lastName" : "Doe",
    "_embedded" : {
        "address" : {
            "city" : "Paris",
            "country" : "France",
            "street" : "142 Rue de Rivoli",
            "zip" : "75001",
            "_links" : {
                "self" : {
                    "href" : "http://localhost/backbone.hateoas/test/api/addresses/1"
                }
            }
        }
    },
    "_links" : {
        "address" : {
            "href" : "http://localhost/backbone.hateoas/test/api/addresses/1"
        },
        "self" : { 
            "href" : "http://localhost/backbone.hateoas/test/api/users/1"
        }
    }
}
```

#### `urlRoot` property

When you work with HAL you often have a root URL which is global to your API, in most cases this URL is the root of a 
catalog (i.e a special resource describing the documentation of your endpoints and how to access them). 

The `Hal.urlRoot` property allows you to configure this global API root URL (please note that the name `urlRoot` has 
been chosen to be the same as the Backbone Model `urlRoot` parameter).  

For exemple if our API is located at `https://myserver.com/api` then we could declare the following `Hal.urlRoot`.

```javascript
Hal.urlRoot = 'https://myserver.com/api';
```

After that `Hal.Collection` and `Hal.Model` can automatically generate absolute API urls for you.
```javascript
var users = new Hal.Collection();
users.urlMiddle = 'users';

// Fetch 'https://myserver.com/api/users'
users.fetch(); 

// Hal.Model can also be used easily without any associated collection
// This will fetch 'https://myserver.com/api/users/1'
var john = new Hal.Model();
john.urlMiddle = 'users';
john.set('id', 1);
john.fetch();

// If you want you can "force" use of other absolute URLs
// This will fetch 'https://myserver2.com/api/users'
users.url = 'https://myserver2.com/api/users';
users.fetch();

// This will fetch 'https://myserver2.com/api/users/jdoe'
john.urlRoot = 'https://myserver2.com/api/users/jdoe';
john.fetch();
```

### HAL Resource classes

The HAL standard defines a generic resource concept, but Backbone defines 2 kinds of "resources" (the models and the 
collections). 

So backbone.hateoas defines 2 kinds of resources : 
 * The `Hal.Model` class defines a generic HAL resource and is very similar to the `Backbone.Model` class ;
 * The `Hal.Collection` class is a specialized HAL resource dedicated to manipulation of collection resources, this one 
   is a little opinionated (but its design is based on REST API best practices).

#### Hal.Model

##### `urlMiddle` property

The `urlMiddle` is an additional URL parameter specific to backbone.hateoas and which easier model fetching without 
being forced to attach your model to a collection.

The `urlMiddle` is used only when your model is not linked to a collection having a URL and which do not define a 
specific `urlRoot` property. 

The `urlMiddle` is used to create an absolute URL (with the `url()` method) equal to the concatenation of the 
`Hal.urlRoot` property plus the `urlMiddle`.

Here is an exemple : 
```javascript
Hal.urlRoot = 'https://myserver.com/api';

// This will fetch 'https://myserver.com/api/users/1'
var john = new Hal.Model();
john.urlMiddle = 'users';
john.set('id', 1);
john.fetch();

// This will fetch 'https://myserver.com/api/companies/2/users/1'
john = new Hal.Model();
john.urlMiddle = 'companies/2/users';
john.set('id', 1);
john.fetch();
```

##### `toJSON([options])` method

By default the Backbone `toJSON([options])` method do not accept or use any option, a `Hal.Model` can use an additional 
`contentType` option which can be equal to `application/json` or `application/hal+json`. 

When the `toJSON([options])` method is called with this option it overwrites the `Hal.contentType` configuration only 
for this call. 

In most cases this is useful when you when to store a serialized version of a resource somewhere (in the local storage 
for example). 

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

backbone.hateoas has initialy been designed to work with the HAL standard so it allows to manipulate REST resources and 
what we call embedded resources. 

When working with embedded resources **YOU MUST ALWAYS** use the `*Embedded(...)` methods provided by the library 
otherwise the serialization / deserialization will not work as expected. 

This design has also been decided to "force" developers to show their intention in the code source, so if you see a 
`getEmbedded(...)` instruction somewhere you known its to get an embedded resource and not only a "generic object".

When you have an `Hal.Model` object (for example `user`) which embeds an other `Hal.Model` object (for example `address`
) then the first object do not have a direct `address` link. Instead each `Hal.Model` object is linked to a special 
`Hal.Embedded` object which transports the associated embedded resources. 

Here is an example.

```javascript
var john = new Hal.Model();
john.urlMiddle = 'users';
john.set('id', 1);
john.fetch({
    success : function() {
    
        // Gets the '_embedded' resources container
        var embedded  = john.getEmbedded();
        var address = embedded.get('address');
        
        // We can also get the embedded addres using a shortcut method
        address = john.getEmbedded('address');
        
        // Set we can also change the embedded resources
        john.setEmbedded('address', new Hal.Model());
        
        // Other simply reset / remove the embedded resources
        john.unsetEmbedded('address');
        
        // Or check if an embedded resource is their
        if(john.hasEmbedded('friends')) {
        
            _.each(john.getEmbedded('friend'), function(friend) {
            
                console.log('A friend of John : ' + friend.get('firstName') + ' ' + friend.get('lastName'));

            });
        
        }
        
    }
});
```

Please note that the utility methods `getEmbedded(...)`, `setEmbedded(...)`, `hasEmbedded(...)` and `unsetEmbedded(...)` 
have been named to be similar to the Backbone `get(...)`, `set(...)`, `has(...)` and `unset(...)` methods.

## Release History 

### 0.1.0-alpha8
 * Fix a bug in the `toJSON()` method, the `contentType` option was not propagated to embedded resources.

### 0.1.0-alpha7
 * Allow the `toJSON()` method to take a `contentType` option to configure how to serialize a resource, this is useful 
   when you when to serialize an HAL resource to persist it in the local storage for example.

### 0.1.0-alpha6
 * Allow the `toJSON()` methods to return plain JSON or HAL JSON
 * Add a new global `Hal.contentType` parameter to configure the behavior of the `toJSON()` methods
 * Add documentation to explain how to manipulate embedded resources

### 0.1.0-alpha5
 * Fix documentation, we talked about a `middleUrl` parameter but it was `urlMiddle`
 * Fix several serialization / deserialization bugs.

### 0.1.0-alpha4
 * Add a global `Hal.urlRoot` parameter
 * Add a new `urlMiddle` parameter to be used with `Hal.Collection` and `Hal.Model`
 * Fix several `toJSON()` method implementations
 * Now the `Hal.Model` class is initialized in the `set(key, val, options)` method instead of `initialize(options)`
 * Fix embedded array resource parsing
 * Code coverage is better

### 0.1.0-alpha3
 * Fix AMD dependency problem with Underscore

### 0.1.0-alpha2
 * Add `_links` parsing and management
 * Add `_embedded` parsing and management
 * Continue user documentation

### 0.1.0-alpha1
 * First alpha release.
