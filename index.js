'use strict';

var objectAssessor = /\[(["']?)([^\1]+?)\1?\]/g;

function ls(path){
	var keys = path.replace(objectAssessor, '.$2');
	keys = keys.replace(/^\./, '');
	return keys.split('.');
}

function write(target, path, value, overwrite){
	var id = 0;
	var keys = ls(path);
	var total = keys.length - 1;
	var isLikeObject;
	while(id < total){
		path = keys[id++];
		isLikeObject = target[path] === Object(target[path]);
		target = target[path] = isLikeObject? target[path] : {};
	}
	path = keys[id];
	if(typeof(value) === 'undefined'){
		overwrite && delete(target[path]);
	}else{
		value = overwrite? value : target[path] || value;
		target[path] = value;
	}
	return value;
}

function read(target, path){
	var id = 0;
	var keys = ls(path);
	var total = keys.length;
	while((target = target[keys[id++]]) && id < total){}
	return id < total? void(0) : target;
}

function uri(key, value, overwrite){
	var hasValue = arguments.length > 1;
	overwrite = value && typeof overwrite === 'undefined'? true : !!overwrite;
	return hasValue? write(this, key, value, overwrite) : read(this, key);
}

function stub(target, namespace){
	target = target[namespace] = target[namespace] || {};
	target.uri = uri.bind(target);
	return target;
}

function create(namespace){
  return stub({}, namespace);
}

exports.stub = stub;
module.exports = create;
