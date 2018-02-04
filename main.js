const fs = require('fs');
var db = "data.txt";
var map = new Map()

function db_write(key, value) {
    map[key] = value;
    return "saved at: " + key
}

function db_read(key) {
    if (map.hasOwnProperty(key)) { return { key: key, value: map[key] }; }
    //throw new Error("invalid map key: "+key);
    return "invalid map key: " + key
}

function db_read_index(index) {

    var key = Object.keys(map)[index];
    if (key == undefined) {
        //throw new Error("invalid index: "+index);
        return "invalid index: " + index;
    }
    return { key: key, value: map[key] }
}

function db_save_binary() {
    var output = "";
    var input = JSON.stringify(map);
    for (var i = 0; i < input.length; i++) {
        output += input[i].charCodeAt(0).toString(2);
        if (i != input.length - 1) {
            output += " "
        }
    }
    fs.writeFile(db, output, err => {
        if (err) { throw err }
    })
    return output;
}

function db_import_binary() {
    var temp;
    binaryArr = fs.readFileSync(db, "utf8").toString().split(" ");
    var binaryCode = [];
    var output = "";
    for (i = 0; i < binaryArr.length; i++) {
        output += String.fromCharCode(parseInt(binaryArr[i], 2));

    }
    if (binaryArr.length > 1) {
        map = new Map()
        var temp = JSON.parse(output)
        Object.keys(temp).forEach(function (k) {
            map[k] = temp[k]
        });
    }
    return output
}


var new_key = "key" + Math.floor(Math.random() * 1000)

console.log("current map:    ", JSON.stringify(map));
console.log("imported map:   ", db_import_binary());
console.log("save data:      ", db_write(new_key, "lots of data"));
console.log("save data:      ", db_write(new_key + "2", "lots of other data"));
console.log("read by key:    ", db_read(new_key));
console.log("read by key:    ", db_read(new_key + "3"));
console.log("read by index:  ", db_read_index(1));
console.log("read by index:  ", db_read_index(map.size + 5));
console.log("save to binary: ", db_save_binary());
