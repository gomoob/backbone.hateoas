<?php

$payload = <<<EOT
{
    "firstName" : "John", 
    "lastName" : "Doe", 
    "_links" : {
		"address" : {
		    "href" : "http://localhost/backbone.hateoas/test/api/addresses/1"
		},
        "self" : { 
		    "href" : "http://localhost/backbone.hateoas/test/api/users/1"
		}
    },
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
	}
}
EOT;

header('Content-Type: application/json+hal');
echo $payload;
