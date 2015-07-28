var request = require('request');
var moment = require('moment');

exports.sortResults = function(arr, prop, asc, type) {
	if(type == 'string'){
		 return arr = arr.sort(function(a, b) {
			if (asc == 'asc') return (a[prop] > b[prop]);
			else return (b[prop] > a[prop]);
		});
	}
	else{
		return arr = arr.sort(function(a, b) {
			if( parseInt(a[prop]) > parseInt(b[prop])) return 1;
			else if( parseInt(a[prop]) < parseInt(b[prop]) ) return -1;
			return 0;
		});
	}
};