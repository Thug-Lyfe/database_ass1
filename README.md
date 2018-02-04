# database_ass1
This repo contains the main.js and a data.txt file.
The main.js has 5 functions and 1 map.
  1. db_write.        used to add elements to the map
  2. db_read.         uses a key to get a value from the map
  3. db_read_index.   uses an index to get a value from the map
  4. db_save_binary.  translates the map into binary and saves it to data.txt
  5. db_import_binary translates the data.txt file into a map
 
The data.txt file contains the binary database.
To try it out run node "path_to_main.js"
1. It should load the database from binary and translate into a map,
2. Create 2 more elements with some random keys and values
3. Read a key that exists and a key that does not exist
4. Read some keys/values from an index that is in the map and one that is oob.
5. Save it to the binary file
