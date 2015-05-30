<?php 

$prefixIdentifier = 'api/';
$prefixPos = strpos($_SERVER['REQUEST_URI'], $prefixIdentifier);
$suffix = substr($_SERVER['REQUEST_URI'], $prefixPos + strlen($prefixIdentifier));

// /users
if(strpos($suffix, 'users') !== false) {

	require_once 'users.php';
	
}