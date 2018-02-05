const fs = require('fs');
let db = "data.txt";
let database = "database.txt";
let map = new Map()

function db_write(key, data) {
    map[key] = fs.statSync("database.txt").size;
    fs.appendFile(database, key + "," + data + "\n", err => {
        if (err) { throw err }
    })
    return "saved at: " + key
}

function db_read(key, callback) {
    if (map.hasOwnProperty(key)) {
        fs.open(database, 'r', function (status, fd) {
            let next = Object.keys(map).indexOf(key) + 1;
            if (next >= Object.keys(map).length) {
                next = fs.statSync("database.txt").size - map[key];
            } else {
                next = map[Object.keys(map)[next]] - map[key];
            }
            let buffer = new Buffer(next);
            fs.read(fd, buffer, 0, next, 0, function () {
                callback({ key: key, offset: map[key], data: buffer.toString('utf8').slice(0, -1) });
            });
        });
    }else{callback("invalid map key: " + key)}
}

function db_read_index(index, callback) {
    let key = Object.keys(map)[index];
    if (key == undefined) {
        callback("invalid index: " + index);
    } else {
        fs.open(database, 'r', function (status, fd) {
            let next = index + 1;
            if (next >= Object.keys(map).length) {
                next = fs.statSync("database.txt").size - map[key];
            } else {
                next = map[Object.keys(map)[next]] - map[key];
            }
            console.log(Object.keys(map)[next], map[key])
            let buffer = new Buffer(next);
            fs.read(fd, buffer, 0, next, 0, function () {
                console.log(map[key], Object.keys(map).indexOf(key), next)
                callback({ key: key, offset: map[key], data: buffer.toString('utf8').slice(0, -1) });
            });
        });
    }
}

function db_save_binary() {
    let output = "";
    let input = JSON.stringify(map);
    for (let i = 0; i < input.length; i++) {
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
    let temp;
    binaryArr = fs.readFileSync(db, "utf8").toString().split(" ");
    let binaryCode = [];
    let output = "";
    for (i = 0; i < binaryArr.length; i++) {
        output += String.fromCharCode(parseInt(binaryArr[i], 2));

    }
    if (binaryArr.length > 1) {
        map = new Map()
        let temp = JSON.parse(output)
        Object.keys(temp).forEach(function (k) {
            map[k] = temp[k]
        });
    }
    return output
}

let new_key = "key" + Math.floor(Math.random() * 1000)
console.log("imported map:   ",db_import_binary() ,"\n------------------------------------------------------------");
console.log("save data:      ", db_write(new_key, '{"stuff":"lots of data"}'));
console.log("save data:      ", db_write(new_key + "2", '{"stuff":"lots of other data"}'));
console.log("current map:    ", JSON.stringify(map),"\n------------------------------------------------------------");
db_read(new_key + 3, (data) => {
    console.log("read wrong key name:    ", data);
})
db_read_index(Object.keys(map).length + 2, (data) => {
    console.log("read wrong key index:    ", data);
    
})
db_read(new_key, (data) => {
    console.log("read correct key name:    ", data);
})
db_read_index(0, (data) => {
    console.log("read correct key index:    ", data,"\n------------------------------------------------------------");
    console.log("save to binary: ", db_save_binary());
})