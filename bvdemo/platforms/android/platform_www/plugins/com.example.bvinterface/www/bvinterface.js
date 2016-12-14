cordova.define("com.example.bvinterface.bvinterface", function(require, exports, module) {
/*global cordova, module*/

module.exports = {
    greet: function (name, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "BVInterface", "greet", [name]);
    }
};

});
