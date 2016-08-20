
function Container(){
    var bindings = {};
}

Container.prototype.bind = function(interface, implementation) {

    this.bindings[interface] = implementation;

}

Container.prototype.new = function(interface) {

    if(!this.bindings[interface]) {
        throw "Invalid class definition";
    }
        
    return new this.bindings[interface]();
}



module.exports = Container;